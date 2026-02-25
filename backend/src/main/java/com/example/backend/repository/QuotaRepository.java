package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Quota;

public interface QuotaRepository extends JpaRepository<Quota, Long> {

    Optional<Quota> findByProgramIdAndQuotaType(Long programId, String quotaType);

    java.util.List<Quota> findByProgramId(Long programId);
}