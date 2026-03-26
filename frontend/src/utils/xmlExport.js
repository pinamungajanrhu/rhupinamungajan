// XML Export Utility for Patient Data

export const exportPatientsToXML = (patients, includeAssessments = false, includeConsultations = false) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<patients>
  <export_info>
    <export_date>${new Date().toISOString()}</export_date>
    <total_patients>${patients.length}</total_patients>
    <include_assessments>${includeAssessments}</include_assessments>
    <include_consultations>${includeConsultations}</include_consultations>
  </export_info>
  <patient_records>`;

  patients.forEach(patient => {
    xml += `
    <patient id="${patient.id}">
      <personal_info>
        <first_name>${escapeXml(patient.first_name || '')}</first_name>
        <middle_name>${escapeXml(patient.middle_name || '')}</middle_name>
        <last_name>${escapeXml(patient.last_name || '')}</last_name>
        <suffix>${escapeXml(patient.suffix || '')}</suffix>
        <birthdate>${patient.birthdate || ''}</birthdate>
        <birthplace>${escapeXml(patient.birthplace || '')}</birthplace>
        <sex>${escapeXml(patient.sex || '')}</sex>
        <civil_status>${escapeXml(patient.civil_status || '')}</civil_status>
        <blood_type>${escapeXml(patient.blood_type || '')}</blood_type>
      </personal_info>
      
      <contact_info>
        <mobile>${escapeXml(patient.mobile || '')}</mobile>
        <landline>${escapeXml(patient.landline || '')}</landline>
        <email>${escapeXml(patient.email || '')}</email>
      </contact_info>
      
      <address>
        <country>${escapeXml(patient.country || '')}</country>
        <region>${escapeXml(patient.region || '')}</region>
        <province>${escapeXml(patient.province || '')}</province>
        <city_municipality>${escapeXml(patient.city_municipality || '')}</city_municipality>
        <barangay>${escapeXml(patient.barangay || '')}</barangay>
        <number_street>${escapeXml(patient.number_street || '')}</number_street>
        <zip_code>${escapeXml(patient.zip_code || '')}</zip_code>
      </address>
      
      <family_info>
        <mother_first_name>${escapeXml(patient.mother_first_name || '')}</mother_first_name>
        <mother_last_name>${escapeXml(patient.mother_last_name || '')}</mother_last_name>
        <mother_middle_name>${escapeXml(patient.mother_middle_name || '')}</mother_middle_name>
        <mother_birthdate>${patient.mother_birthdate || ''}</mother_birthdate>
        <family_member>${escapeXml(patient.family_member || '')}</family_member>
      </family_info>
      
      <socioeconomic>
        <educational_attainment>${escapeXml(patient.educational_attainment || '')}</educational_attainment>
        <employment_status>${escapeXml(patient.employment_status || '')}</employment_status>
        <monthly_income>${escapeXml(patient.monthly_income || '')}</monthly_income>
        <occupation>${escapeXml(patient.occupation || '')}</occupation>
        <religion>${escapeXml(patient.religion || '')}</religion>
        <indigenous>${escapeXml(patient.indigenous || '')}</indigenous>
      </socioeconomic>
      
      <health_info>
        <philhealth_member>${escapeXml(patient.philhealth_member || '')}</philhealth_member>
        <philhealth_number>${escapeXml(patient.philhealth_number || '')}</philhealth_number>
        <philhealth_category>${escapeXml(patient.philhealth_category || '')}</philhealth_category>
        <pcb_eligible>${escapeXml(patient.pcb_eligible || '')}</pcb_eligible>
        <status>${escapeXml(patient.status || '')}</status>
      </health_info>
      
      <system_info>
        <created_at>${patient.created_at || ''}</created_at>
        <updated_at>${patient.updated_at || ''}</updated_at>
        <created_by>${patient.created_by || ''}</created_by>
      </system_info>
    </patient>`;
  });

  xml += `
  </patient_records>
</patients>`;

  return xml;
};

export const exportSinglePatientToXML = async (patientId, axios) => {
  try {
    // Fetch complete patient data including assessments and consultations
    const [patientRes, assessmentRes, consultationRes] = await Promise.all([
      axios.get(`/api/residents/${patientId}`),
      axios.get(`/api/assessments/resident/${patientId}`).catch(() => null),
      axios.get(`/api/consultations/resident/${patientId}`).catch(() => null)
    ]);

    const patient = patientRes.data;
    const assessment = assessmentRes?.data;
    const consultations = consultationRes?.data || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<patient_export>
  <export_info>
    <export_date>${new Date().toISOString()}</export_date>
    <patient_id>${patient.id}</patient_id>
    <patient_name>${escapeXml(`${patient.first_name} ${patient.last_name}`)}</patient_name>
  </export_info>
  
  <patient id="${patient.id}">
    <personal_info>
      <first_name>${escapeXml(patient.first_name || '')}</first_name>
      <middle_name>${escapeXml(patient.middle_name || '')}</middle_name>
      <last_name>${escapeXml(patient.last_name || '')}</last_name>
      <suffix>${escapeXml(patient.suffix || '')}</suffix>
      <birthdate>${patient.birthdate || ''}</birthdate>
      <birthplace>${escapeXml(patient.birthplace || '')}</birthplace>
      <sex>${escapeXml(patient.sex || '')}</sex>
      <civil_status>${escapeXml(patient.civil_status || '')}</civil_status>
      <educational_attainment>${escapeXml(patient.educational_attainment || '')}</educational_attainment>
      <employment_status>${escapeXml(patient.employment_status || '')}</employment_status>
      <monthly_income>${escapeXml(patient.monthly_income || '')}</monthly_income>
      <occupation>${escapeXml(patient.occupation || '')}</occupation>
      <religion>${escapeXml(patient.religion || '')}</religion>
      <indigenous>${escapeXml(patient.indigenous || '')}</indigenous>
      <blood_type>${escapeXml(patient.blood_type || '')}</blood_type>
    </personal_info>
    
    <contact_info>
      <mobile>${escapeXml(patient.mobile || '')}</mobile>
      <landline>${escapeXml(patient.landline || '')}</landline>
      <email>${escapeXml(patient.email || '')}</email>
    </contact_info>
    
    <address>
      <country>${escapeXml(patient.country || '')}</country>
      <region>${escapeXml(patient.region || '')}</region>
      <province>${escapeXml(patient.province || '')}</province>
      <city_municipality>${escapeXml(patient.city_municipality || '')}</city_municipality>
      <barangay>${escapeXml(patient.barangay || '')}</barangay>
      <number_street>${escapeXml(patient.number_street || '')}</number_street>
      <zip_code>${escapeXml(patient.zip_code || '')}</zip_code>
    </address>
    
    <family_info>
      <mother_first_name>${escapeXml(patient.mother_first_name || '')}</mother_first_name>
      <mother_last_name>${escapeXml(patient.mother_last_name || '')}</mother_last_name>
      <mother_middle_name>${escapeXml(patient.mother_middle_name || '')}</mother_middle_name>
      <mother_birthdate>${patient.mother_birthdate || ''}</mother_birthdate>
      <family_member>${escapeXml(patient.family_member || '')}</family_member>
      <dswd_nhts_member>${patient.dswd_nhts_member ? 'true' : 'false'}</dswd_nhts_member>
      <facility_household_number>${escapeXml(patient.facility_household_number || '')}</facility_household_number>
      <family_serial_number>${escapeXml(patient.family_serial_number || '')}</family_serial_number>
    </family_info>
    
    <health_insurance>
      <philhealth_member>${escapeXml(patient.philhealth_member || '')}</philhealth_member>
      <philhealth_number>${escapeXml(patient.philhealth_number || '')}</philhealth_number>
      <philhealth_category>${escapeXml(patient.philhealth_category || '')}</philhealth_category>
      <pcb_eligible>${escapeXml(patient.pcb_eligible || '')}</pcb_eligible>
    </health_insurance>
    
    <status_info>
      <current_status>${escapeXml(patient.status || '')}</current_status>
      <created_at>${patient.created_at || ''}</created_at>
      <updated_at>${patient.updated_at || ''}</updated_at>
      <created_by>${patient.created_by || ''}</created_by>
    </status_info>`;

    // Add assessment if available
    if (assessment) {
      xml += `
    
    <health_assessment>
      <consultation_date>${assessment.consultation_date || ''}</consultation_date>
      <assessed_by>${escapeXml(assessment.assessed_by || '')}</assessed_by>
      <type_of_exposure>${escapeXml(assessment.type_of_exposure || '')}</type_of_exposure>
      <bite_event_description>${escapeXml(assessment.bite_event_description || '')}</bite_event_description>
      <date_of_exposure>${assessment.date_of_exposure || ''}</date_of_exposure>
      <site_of_bite>${escapeXml(assessment.site_of_bite || '')}</site_of_bite>
      <category_of_bite>${escapeXml(assessment.category_of_bite || '')}</category_of_bite>
      <washing_of_wound>${assessment.washing_of_wound ? 'true' : 'false'}</washing_of_wound>
      <duration>${escapeXml(assessment.duration || '')}</duration>
      <soap_used>${assessment.soap_used ? 'true' : 'false'}</soap_used>
      <antibiotic_use>${escapeXml(assessment.antibiotic_use || '')}</antibiotic_use>
      <tetanus_vaccine>${assessment.tetanus_vaccine ? 'true' : 'false'}</tetanus_vaccine>
      <tetanus_given_date>${assessment.tetanus_given_date || ''}</tetanus_given_date>
      <tetanus_vaccine_type>${escapeXml(assessment.tetanus_vaccine_type || '')}</tetanus_vaccine_type>
      <animal_type>${escapeXml(assessment.animal_type || '')}</animal_type>
      <animal_owned>${assessment.animal_owned ? 'true' : 'false'}</animal_owned>
      <observed_by_patient>${assessment.observed_by_patient ? 'true' : 'false'}</observed_by_patient>
      <animal_vaccinated>${assessment.animal_vaccinated ? 'true' : 'false'}</animal_vaccinated>
      <vaccination_date>${assessment.vaccination_date || ''}</vaccination_date>
      <vaccination_type>${escapeXml(assessment.vaccination_type || '')}</vaccination_type>
      <vaccination_category>${escapeXml(assessment.vaccination_category || '')}</vaccination_category>
      <vaccination_brand>${escapeXml(assessment.vaccination_brand || '')}</vaccination_brand>
      <animal_confinement>${assessment.animal_confinement ? 'true' : 'false'}</animal_confinement>
      <confinement_date>${assessment.confinement_date || ''}</confinement_date>
      <died>${assessment.died ? 'true' : 'false'}</died>
      <date_of_death>${assessment.date_of_death || ''}</date_of_death>
      <cause_of_death>${escapeXml(assessment.cause_of_death || '')}</cause_of_death>
      <comorbidities>${escapeXml(assessment.comorbidities || '')}</comorbidities>
      <personal_history>${escapeXml(assessment.personal_history || '')}</personal_history>
      <family_history>${escapeXml(assessment.family_history || '')}</family_history>
      <smoking_history>${escapeXml(assessment.smoking_history || '')}</smoking_history>
      <social_history>${escapeXml(assessment.social_history || '')}</social_history>
      <alcohol_intake>${escapeXml(assessment.alcohol_intake || '')}</alcohol_intake>
      <physical_activity>${assessment.physical_activity ? 'true' : 'false'}</physical_activity>
      <diagnosis>${escapeXml(assessment.diagnosis || '')}</diagnosis>
      <treatment_plan>${escapeXml(assessment.treatment_plan || '')}</treatment_plan>
    </health_assessment>`;
    }

    // Add consultations if available
    if (consultations.length > 0) {
      xml += `
    
    <consultations>`;
      
      consultations.forEach(consultation => {
        xml += `
      <consultation id="${consultation.id}">
        <consultation_date>${consultation.created_at || ''}</consultation_date>
        <doctor_id>${consultation.doctor_id || ''}</doctor_id>
        <diagnosis>${escapeXml(consultation.diagnosis || '')}</diagnosis>
        <findings>${escapeXml(consultation.findings || '')}</findings>
        <health_condition>${escapeXml(consultation.health_condition || '')}</health_condition>
        <illness_type>${escapeXml(consultation.illness_type || '')}</illness_type>
        <prescription>${escapeXml(consultation.prescription || '')}</prescription>
        <follow_up_date>${consultation.follow_up_date || ''}</follow_up_date>
        <yakap_id>${escapeXml(consultation.yakap_id || '')}</yakap_id>
        <created_at>${consultation.created_at || ''}</created_at>
        <updated_at>${consultation.updated_at || ''}</updated_at>
      </consultation>`;
      });
      
      xml += `
    </consultations>`;
    }

    xml += `
  </patient>
</patient_export>`;

    return xml;
  } catch (error) {
    console.error('Error exporting patient to XML:', error);
    throw error;
  }
};

// Helper function to escape XML special characters
const escapeXml = (text) => {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Download XML file
export const downloadXML = (xmlContent, filename) => {
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
