package com.vayura.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    public record EmergencyContact(String service, String number, String notes) {}
    public record GovernmentPortal(String name, String url, String description, String category) {}
    
    public record CountryDetail(
            String code,
            String name,
            String flag,
            String currency,
            String currencySymbol,
            List<String> languages,
            String timezone,
            String capitalCity,
            String region,
            String callingCode,
            List<EmergencyContact> emergencyContacts,
            List<GovernmentPortal> governmentPortals,
            String lastVerified
    ) {}

    private static final Map<String, CountryDetail> COUNTRIES = new LinkedHashMap<>();

    static {
        COUNTRIES.put("KR", new CountryDetail(
                "KR", "South Korea", "🇰🇷", "KRW", "₩",
                List.of("Korean", "English"), "Asia/Seoul", "Seoul", "East Asia", "+82",
                List.of(
                        new EmergencyContact("Police", "112", "Emergency response"),
                        new EmergencyContact("Fire & Ambulance", "119", "Medical/rescue"),
                        new EmergencyContact("Foreign Help Line", "1345", "24/7 multilingual official helpline"),
                        new EmergencyContact("Tourist Complaint & Info", "1330", "Korea Tourism Org 24/7 hotline")
                ),
                List.of(
                        new GovernmentPortal("Hi Korea", "https://www.hikorea.go.kr", "Official foreigner immigration e-services", "Immigration"),
                        new GovernmentPortal("Korea Immigration Service", "https://www.immigration.go.kr", "Immigration policies & visa guidelines", "Immigration"),
                        new GovernmentPortal("Study in Korea", "https://www.studyinkorea.go.kr", "National higher education gateway for foreign students", "Education"),
                        new GovernmentPortal("Visit Korea", "https://english.visitkorea.or.kr", "Official Korea Tourism Organization portal", "Tourism")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("JP", new CountryDetail(
                "JP", "Japan", "🇯🇵", "JPY", "¥",
                List.of("Japanese", "English"), "Asia/Tokyo", "Tokyo", "East Asia", "+81",
                List.of(
                        new EmergencyContact("Police", "110", "National emergency police line"),
                        new EmergencyContact("Fire & Ambulance", "119", "Fire/rescue/medical emergency"),
                        new EmergencyContact("Japan Helpline", "0120-461-997", "Toll-free 24/7 crisis support for foreigners"),
                        new EmergencyContact("JNTO Tourist Hotline", "050-3816-2720", "24/7 multilingual visitor emergency assistance")
                ),
                List.of(
                        new GovernmentPortal("Immigration Services Agency", "https://www.isa.go.jp/en", "Official Japan immigration & residency authority", "Immigration"),
                        new GovernmentPortal("JASSO", "https://www.jasso.or.jp/en", "Japan Student Services Organization official portal", "Education"),
                        new GovernmentPortal("Japan Travel (JNTO)", "https://www.japan.travel/en/", "Official Japan National Tourism Organization", "Tourism")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("DE", new CountryDetail(
                "DE", "Germany", "🇩🇪", "EUR", "€",
                List.of("German", "English"), "Europe/Berlin", "Berlin", "Western Europe", "+49",
                List.of(
                        new EmergencyContact("Police", "110", "German Federal & State Police"),
                        new EmergencyContact("Medical Emergency & Fire", "112", "Universal European emergency line"),
                        new EmergencyContact("Non-Emergency Medical", "116 117", "On-call medical duty service 24/7")
                ),
                List.of(
                        new GovernmentPortal("Make It in Germany", "https://www.make-it-in-germany.com/en", "Federal government portal for qualified professionals", "Employment"),
                        new GovernmentPortal("Federal Foreign Office", "https://www.auswaertiges-amt.de/en", "Visa issuance & entry regulations", "Immigration"),
                        new GovernmentPortal("DAAD", "https://www.daad.de/en", "German Academic Exchange Service for international students", "Education")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("SG", new CountryDetail(
                "SG", "Singapore", "🇸🇬", "SGD", "S$",
                List.of("English", "Mandarin", "Malay", "Tamil"), "Asia/Singapore", "Singapore", "Southeast Asia", "+65",
                List.of(
                        new EmergencyContact("Police", "999", "Singapore Police Force"),
                        new EmergencyContact("Emergency Ambulance & Fire", "995", "SCDF emergency response"),
                        new EmergencyContact("Non-Emergency Ambulance", "1777", "Medical transport helpline")
                ),
                List.of(
                        new GovernmentPortal("Immigration & Checkpoints Authority (ICA)", "https://www.ica.gov.sg", "Passports, visas, and border entry", "Immigration"),
                        new GovernmentPortal("Ministry of Manpower (MOM)", "https://www.mom.gov.sg", "Employment passes & work permits", "Employment"),
                        new GovernmentPortal("Gov.sg", "https://www.gov.sg", "Official Singapore state portal", "General")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("AE", new CountryDetail(
                "AE", "United Arab Emirates", "🇦🇪", "AED", "AED",
                List.of("Arabic", "English"), "Asia/Dubai", "Abu Dhabi", "Middle East", "+971",
                List.of(
                        new EmergencyContact("Police", "999", "UAE Emergency Police"),
                        new EmergencyContact("Ambulance", "998", "National emergency medical service"),
                        new EmergencyContact("Fire & Civil Defence", "997", "Civil protection")
                ),
                List.of(
                        new GovernmentPortal("UAE Government Unified Portal", "https://u.ae/en", "Comprehensive government services and residency info", "General"),
                        new GovernmentPortal("Federal Authority for Identity & Citizenship", "https://www.icp.gov.ae/en", "Emirates ID & residency visas", "Immigration")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("GB", new CountryDetail(
                "GB", "United Kingdom", "🇬🇧", "GBP", "£",
                List.of("English"), "Europe/London", "London", "Western Europe", "+44",
                List.of(
                        new EmergencyContact("Emergency Services", "999", "Police, Fire, Ambulance, Coastguard"),
                        new EmergencyContact("Non-Emergency Police", "101", "Local police reporting"),
                        new EmergencyContact("NHS Health Helpline", "111", "24/7 urgent medical triage")
                ),
                List.of(
                        new GovernmentPortal("GOV.UK Visas and Immigration", "https://www.gov.uk/government/organisations/uk-visas-and-immigration", "Official UK visa authority", "Immigration"),
                        new GovernmentPortal("NHS UK", "https://www.nhs.uk", "National Health Service access guide", "Healthcare"),
                        new GovernmentPortal("UCAS", "https://www.ucas.com", "UK higher education admissions portal", "Education")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("US", new CountryDetail(
                "US", "United States", "🇺🇸", "USD", "$",
                List.of("English", "Spanish"), "America/New_York", "Washington D.C.", "North America", "+1",
                List.of(
                        new EmergencyContact("Universal Emergency", "911", "Police, Fire, Paramedics nationwide"),
                        new EmergencyContact("Non-Emergency City Services", "311", "Local municipal assistance"),
                        new EmergencyContact("Crisis & Suicide Lifeline", "988", "24/7 confidential mental health support")
                ),
                List.of(
                        new GovernmentPortal("USCIS", "https://www.uscis.gov", "US Citizenship and Immigration Services", "Immigration"),
                        new GovernmentPortal("US Department of State Travel", "https://travel.state.gov", "Visa categories and embassy directory", "Travel"),
                        new GovernmentPortal("USA.gov", "https://www.usa.gov", "Official guide to US government services", "General")
                ),
                "2026-11-01"
        ));

        COUNTRIES.put("IN", new CountryDetail(
                "IN", "India", "🇮🇳", "INR", "₹",
                List.of("Hindi", "English"), "Asia/Kolkata", "New Delhi", "South Asia", "+91",
                List.of(
                        new EmergencyContact("National Emergency Helpline", "112", "Unified all-in-one emergency service"),
                        new EmergencyContact("Police", "100", "State police emergency response"),
                        new EmergencyContact("Medical Ambulance", "102", "National health ambulance service"),
                        new EmergencyContact("Fire Control", "101", "Fire and rescue")
                ),
                List.of(
                        new GovernmentPortal("National Portal of India", "https://www.india.gov.in", "Official gateway to Indian government", "General"),
                        new GovernmentPortal("Passport Seva", "https://www.passportindia.gov.in", "Consular, passport and visa division", "Immigration")
                ),
                "2026-11-01"
        ));
    }

    @GetMapping
    public ResponseEntity<List<CountryDetail>> getAllCountries() {
        return ResponseEntity.ok(new ArrayList<>(COUNTRIES.values()));
    }

    @GetMapping("/{code}")
    public ResponseEntity<CountryDetail> getCountry(@PathVariable String code) {
        CountryDetail country = COUNTRIES.get(code.toUpperCase());
        if (country == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(country);
    }
}

