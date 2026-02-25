package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Admission;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    long countByQuotaId(Long quotaId);

    boolean existsByApplicantId(Long applicantId);
}