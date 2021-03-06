import React, { useContext, useEffect } from 'react';
import { Table, Modal, Tooltip } from 'choerodon-ui/pro';
import { Action, StatusTag } from '@choerodon/boot';
import WebhookRecordDetail from './WebhookRecordDetail';
import TimePopover from '../../components/timePopover/TimePopover';

const { Column } = Table;

const WebhookRecord = ({ webhookId, ds, type, id, orgId, useStore, modal }) => {
  useEffect(() => {
    ds.queryUrl = `notify/v1/${type === 'project' ? `project/${id}` : `organization/${orgId}`}/web_hook_records${webhookId ? `?webhook_id=${webhookId}` : ''}`;
    // ds.setQueryParameter('webhookId', webhookId);

    ds.query();
    modal.update({
      okText: '关闭',
    });
  }, []);

  const handleAction = async (record) => {
    if (record.get('status') === 'RUNNING') {
      try {
        await useStore.handleForceFailure(type, id, orgId, record.get('id'));
        ds.query();
      } catch (e) {
        window.console.log(e);
      }
    } else {
      try {
        await useStore.handleRetryRecord(type, id, orgId, record.get('id'));
        ds.query();
      } catch (e) {
        window.console.log(e);
      }
    }
  };

  const ActionRenderer = ({ record }) => {
    const actionArr = [{
      service: [],
      text: record.get('status') === 'RUNNING' ? '强制失败' : '重新执行',
      action: () => handleAction(record),
    }];
    return <Action className="action-icon" data={actionArr} />;
  };

  const statusRenderer = ({ record, value }) => {
    const statusKeyValue = {
      COMPLETED: {
        name: '成功',
        color: 'rgba(0, 191, 165, 1)',
      },
      FAILED: {
        name: '失败',
        color: 'rgb(241, 111, 127)',
      },
      RUNNING: {
        name: '执行中',
        color: '#4D90FE',
      },
    };
    return <StatusTag name={statusKeyValue[value].name} color={statusKeyValue[value].color} />;
  };

  const handleClickName = (record) => {
    Modal.open({
      title: 'Webhook记录详情',
      key: Modal.key(),
      drawer: true,
      okText: '关闭',
      okCancel: false,
      style: {
        width: 740,
      },
      children: <WebhookRecordDetail ds={ds} recordId={record.get('id')} itemType={record.get('status')} type={type} id={id} orgId={orgId} useStore={useStore} />,
    });
  };

  const nameRender = ({ record, value }) => <p className="webhookRecord_table_name" onClick={() => handleClickName(record)}>{value}</p>;

  const handleRenderSendTime = ({ record, value }) => (
    <TimePopover content={record.get('sendTime')} />
  );

  const handleRenderWebhookPath = ({ value }) => (
    <Tooltip placement="top" title={value}>
      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
    </Tooltip>
  );


  return (
    <Table
      dataSet={ds}
      queryBar="advancedBar"
      queryFieldsLimit={3}
    >
      <Column name="name" renderer={nameRender} />
      <Column renderer={ActionRenderer} width={48} />
      <Column name="webhookPath" renderer={handleRenderWebhookPath} />
      <Column name="status" renderer={statusRenderer} />
      <Column name="typeString" />
      <Column name="sendTimeAround" renderer={handleRenderSendTime} />
    </Table>
  );
};

export default WebhookRecord;
