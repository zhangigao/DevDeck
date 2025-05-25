package org.zhj.devdeck.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * 七牛云审核结果
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QiniuAuditResult {
    private String id;
    private String pipeline;
    private int code;
    private String desc;
    private String reqid;
    private String inputBucket;
    private String inputKey;
    private List<AuditItem> items;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AuditItem {
        private String cmd;
        private int code;
        private String desc;
        private ItemResult result;
        @JsonProperty("returnOld")
        private int returnOld;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ItemResult {
        private boolean disable;
        private InnerResult result;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class InnerResult {
        private int code;
        private String message;
        private String suggestion;
        private Map<String, SceneResult> scenes; // Key: pulp/terror/politician
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SceneResult {
        private String suggestion;
        private SceneDetailResult result;

        @Data
        @JsonInclude(JsonInclude.Include.NON_NULL)
        public static class SceneDetailResult {
            // 通用字段
            private String label;
            private Double score;

            // politician 特有字段
            private List<Face> faces;

            @Data
            @JsonInclude(JsonInclude.Include.NON_NULL)
            public static class Face {
                @JsonProperty("bounding_box")
                private BoundingBox boundingBox;
                private Double score;
            }

            @Data
            @JsonInclude(JsonInclude.Include.NON_NULL)
            public static class BoundingBox {
                private List<List<Integer>> pts; // 二维坐标点
                private Double score;
            }
        }
    }
}