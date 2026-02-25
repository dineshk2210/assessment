package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Program;
import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByInstitutionId(Long institutionId);
}