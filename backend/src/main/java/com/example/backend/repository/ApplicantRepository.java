package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Applicant;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    long countByProgramIdAndQuotaTypeAndDocumentStatus(Long programId, String quotaType, String documentStatus);
}