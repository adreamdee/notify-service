package io.choerodon.notify.infra.enums;

public enum RecordStatus {
    COMPLETE("COMPLETED"),
    FAILED("FAILED"),
    RUNNING("RUNNING");
    private String value;

    RecordStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}