package io.choerodon.notify.api.controller.v1;

import io.choerodon.core.annotation.Permission;
import io.choerodon.core.enums.ResourceType;
import io.choerodon.notify.api.service.SendSettingService;
import io.choerodon.notify.api.vo.WebHookVO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author lrc
 * @since 2019/10/29
 */
@RestController
@RequestMapping("/v1/projects/{project_id}/send_settings")
public class SendSettingProjectController {

    private static final String PROJECT = "project";
    private static final String ORGANIZATION = "organization";
    private SendSettingService sendSettingService;

    public SendSettingProjectController(SendSettingService sendSettingService) {
        this.sendSettingService = sendSettingService;
    }

    @GetMapping
    @Permission(type = ResourceType.PROJECT)
    @ApiOperation("查询项目下可选的发送设置（用于WebHook）")
    public ResponseEntity<WebHookVO.SendSetting> getSendSettings(@PathVariable("project_id") Long projectId,
                                                                 @RequestParam(name = "name", required = false) String name,
                                                                 @RequestParam(name = "description", required = false) String description,
                                                                 @RequestParam(name = "type", required = false) String type) {
        return new ResponseEntity<>(sendSettingService.getUnderProject(projectId, PROJECT, name, description, type), HttpStatus.OK);
    }


}
