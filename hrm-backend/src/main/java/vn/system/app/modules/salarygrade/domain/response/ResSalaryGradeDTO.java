package vn.system.app.modules.salarygrade.domain.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResSalaryGradeDTO {

    private Long id;
    private String contextType;
    private Long contextId;
    private Integer gradeLevel;
    private boolean active;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}