package com.example.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.backend.entity.Program;
import com.example.backend.entity.Quota;
import com.example.backend.repository.AdmissionRepository;
import com.example.backend.repository.ApplicantRepository;
import com.example.backend.repository.ProgramRepository;
import com.example.backend.repository.QuotaRepository;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private final ProgramRepository programRepo;
        private final AdmissionRepository admissionRepo;
        private final QuotaRepository quotaRepo;
        private final ApplicantRepository applicantRepo;

        public Map<String, Object> getDashboardData() {

                Map<String, Object> response = new HashMap<>();

                // Total intake
                int totalIntake = programRepo.findAll()
                                .stream()
                                .mapToInt(Program::getTotalIntake)
                                .sum();

                // Total admitted or allocated
                long totalAdmitted = admissionRepo.findAll()
                                .stream()
                                .filter(a -> "Confirmed".equals(a.getStatus()) || "Allocated".equals(a.getStatus()))
                                .count();

                // Quota-wise statistics (Latest 5)
                List<Map<String, Object>> quotaStats = new ArrayList<>();

                List<Quota> allQuotas = quotaRepo.findAll(Sort.by(Direction.DESC, "id"));

                for (Quota quota : allQuotas.stream().limit(5).toList()) {
                        long filled = admissionRepo.countByQuotaId(quota.getId());

                        Map<String, Object> q = new HashMap<>();
                        q.put("institution",
                                        quota.getProgram().getInstitution() != null
                                                        ? quota.getProgram().getInstitution().getName()
                                                        : "N/A");
                        q.put("program", quota.getProgram().getName() + " (" + quota.getProgram().getCode() + ")");
                        q.put("quotaType", quota.getQuotaType());
                        q.put("filled", filled);
                        q.put("limit", quota.getSeatLimit());
                        q.put("remaining", quota.getSeatLimit() - filled);
                        quotaStats.add(q);
                }

                // Verified applicants (Total)
                long verifiedApplicants = applicantRepo.findAll()
                                .stream()
                                .filter(a -> "Verified".equals(a.getDocumentStatus()))
                                .count();

                // Applicants with pending documents
                long pendingDocs = applicantRepo.findAll()
                                .stream()
                                .filter(a -> !"Verified".equals(a.getDocumentStatus()))
                                .count();

                // Fee pending list
                long feePending = admissionRepo.findAll()
                                .stream()
                                .filter(a -> !"Paid".equals(a.getFeeStatus()))
                                .count();

                response.put("totalIntake", totalIntake);
                response.put("totalAdmitted", totalAdmitted);
                response.put("quotaStats", quotaStats);
                response.put("verifiedApplicants", verifiedApplicants);
                response.put("pendingDocuments", pendingDocs);
                response.put("feePending", feePending);

                return response;
        }
}