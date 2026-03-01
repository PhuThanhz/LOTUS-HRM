package vn.system.app.modules.salarygrade.domain;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.system.app.common.util.SecurityUtil;

@Entity
@Table(name = "salary_grades", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "context_type", "context_id", "grade_level" })
}, indexes = {
        @Index(name = "idx_salary_grade_context", columnList = "context_type, context_id"),
        @Index(name = "idx_salary_grade_active", columnList = "active")
})
@Getter
@Setter
public class SalaryGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contextType; // "COMPANY", "DEPARTMENT", "SECTION"

    @Column(nullable = false)
    private Long contextId; // ID từ company_job_titles / department_job_titles / section_job_titles

    @Column(name = "grade_level", nullable = false)
    private Integer gradeLevel;

    @Column(nullable = false)
    private boolean active = true;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void handleBeforeCreate() {
        this.active = true;
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().orElse("");
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().orElse("");
    }
}