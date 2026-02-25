package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.Admission;
import com.example.backend.entity.Applicant;
import com.example.backend.entity.Program;
import com.example.backend.entity.Quota;
import com.example.backend.repository.AdmissionRepository;
import com.example.backend.repository.ApplicantRepository;
import com.example.backend.repository.ProgramRepository;
import com.example.backend.repository.QuotaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository admissionRepo;
    private final ApplicantRepository applicantRepo;
    private final ProgramRepository programRepo;
    private final QuotaRepository quotaRepo;

    @Transactional
    public Admission allocateSeat(Long applicantId, Long programId, String quotaType) {

        Applicant applicant = applicantRepo.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        Program program = programRepo.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Quota quota = quotaRepo.findByProgramIdAndQuotaType(programId, quotaType)
                .orElseThrow(() -> new RuntimeException("Quota not found"));

        // Check if documents are verified
        if (!"Verified".equals(applicant.getDocumentStatus())) {
            throw new RuntimeException("Cannot allocate seat. Applicant documents are not verified.");
        }

        // Check if applicant is already allocated/confirmed
        if (admissionRepo.existsByApplicantId(applicantId)) {
            throw new RuntimeException("Applicant already has an allocation or admission");
        }

        long filled = admissionRepo.countByQuotaId(quota.getId());

        if (filled >= quota.getSeatLimit()) {
            throw new RuntimeException("Quota Full for " + quotaType);
        }

        Admission admission = new Admission();
        admission.setApplicant(applicant);
        admission.setProgram(program);
        admission.setQuota(quota);
        admission.setStatus("Allocated");
        admission.setFeeStatus("Pending");

        return admissionRepo.save(admission);
    }

    // @Transactional
    // public Admission confirmAdmission(Long admissionId) {

    // Admission admission = admissionRepo.findById(admissionId)
    // .orElseThrow(() -> new RuntimeException("Admission not found"));

    // if (!"Paid".equals(admission.getFeeStatus())) {
    // throw new RuntimeException("Fee not paid");
    // }

    // if (admission.getAdmissionNumber() == null) {
    // admission.setAdmissionNumber("ADM-" + admission.getId());
    // admission.setStatus("Confirmed");
    // }

    // return admissionRepo.save(admission);
    // }

    @Transactional
    public Admission confirmAdmission(Long admissionId) {

        Admission admission = admissionRepo.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        if (!"Paid".equals(admission.getFeeStatus())) {
            throw new RuntimeException("Fee not paid. Cannot confirm admission.");
        }

        if (admission.getAdmissionNumber() != null) {
            return admission; // already confirmed
        }

        String admissionNumber = generateAdmissionNumber(admission);
        admission.setAdmissionNumber(admissionNumber);
        admission.setStatus("Confirmed");

        return admissionRepo.save(admission);
    }

    private String generateAdmissionNumber(Admission admission) {

        String instCode = admission.getProgram()
                .getInstitution()
                .getCode();

        String year = admission.getProgram().getAcademicYear();
        String courseType = admission.getProgram().getCourseType();
        String programCode = admission.getProgram().getCode();
        String quotaType = admission.getQuota().getQuotaType();

        long count = admissionRepo.count();

        String sequence = String.format("%04d", count);

        return instCode + "/" + year + "/" + courseType + "/" +
                programCode + "/" + quotaType + "/" + sequence;
    }

    @Transactional
    public Admission updateFeeStatus(Long admissionId, String status) {

        Admission admission = admissionRepo.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        admission.setFeeStatus(status);

        return admissionRepo.save(admission);
    }
}