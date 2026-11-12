package com.vayura.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    public record LocalAppDto(
            String id,
            String name,
            String category,
            String countryCode,
            String description,
            String officialWebsite,
            String appStoreUrl,
            String playStoreUrl,
            String verificationStatus,
            String verificationSource,
            String availabilityStatus,
            boolean integrationAvailable,
            BigDecimal payableAmount,
            String payableCurrency,
            List<String> supportedPurposes,
            List<String> tags,
            boolean isFeatured,
            String lastChecked
    ) {}

    private static final List<LocalAppDto> APPS_REGISTRY = new ArrayList<>();

    static {
        // --- SOUTH KOREA ---
        APPS_REGISTRY.add(new LocalAppDto(
                "kr-hikorea", "HiKorea", "GOVERNMENT_SERVICES", "KR",
                "Official Korean Immigration Service portal for foreign residents. Alien registration, visa extensions, and re-entry permits.",
                "https://www.hikorea.go.kr", "https://apps.apple.com/kr/app/hikorea", "https://play.google.com/store/apps/details?id=kr.go.hikorea",
                "OFFICIAL_GOVERNMENT", "https://www.immigration.go.kr", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD"),
                List.of("immigration", "alien-registration", "visa", "official"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-kt-esim", "KT Olleh 5G Unlimited eSIM", "CONNECTIVITY", "KR",
                "Instant South Korea travel eSIM on KT's high-speed 5G network with local phone number and unlimited data.",
                "https://roaming.kt.com", null, null,
                "VERIFIED_COMMERCIAL", "https://roaming.kt.com", "AVAILABLE", true,
                new BigDecimal("28.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("esim", "connectivity", "5g", "mobile", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-tmoney-card", "T-Money Smart Transit Pass", "TRANSPORT_MOBILITY", "KR",
                "Official South Korea universal transit pass for Seoul Subway, Incheon Metro, buses, and taxis nationwide.",
                "https://www.t-money.co.kr", null, null,
                "GOVERNMENT_REGULATED", "https://topis.seoul.go.kr", "AVAILABLE", true,
                new BigDecimal("18.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("metro", "subway", "transit", "tmoney", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-arex-express", "AREX Airport Express Train", "TRANSPORT_MOBILITY", "KR",
                "Non-stop express train connecting Incheon International Airport Terminal 1 & 2 directly to Seoul Station in 43 minutes.",
                "https://www.arex.or.kr", null, null,
                "GOVERNMENT_REGULATED", "https://www.arex.or.kr", "AVAILABLE", true,
                new BigDecimal("9.50"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("train", "arex", "airport-transfer", "express", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-navermap", "Naver Map", "MAPS_NAVIGATION", "KR",
                "Korea's highest precision navigation app with full English language transit routing, walking directions, and subway arrival times.",
                "https://map.naver.com", "https://apps.apple.com/app/naver-map/id311867728", "https://play.google.com/store/apps/details?id=com.nhn.android.nmap",
                "VERIFIED_COMMERCIAL", "https://www.navercorp.com", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("maps", "navigation", "transit", "essential"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-baemin", "Baemin (배달의민족)", "FOOD_DELIVERY", "KR",
                "South Korea's premier food and local grocery delivery service with millions of restaurants and lightning fast delivery.",
                "https://www.baemin.com", "https://apps.apple.com/kr/app/baedalui-minjok", "https://play.google.com/store/apps/details?id=com.sampleapp",
                "VERIFIED_COMMERCIAL", "https://www.woowahan.com", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("food", "dining", "delivery", "takeaway"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-kakaotalk", "KakaoTalk", "COMMUNICATION_COMMUNITY", "KR",
                "The ubiquitous messaging and lifestyle infrastructure in South Korea. Required for campus groups, notifications, and local life.",
                "https://www.kakaocorp.com", "https://apps.apple.com/app/kakaotalk/id362057947", "https://play.google.com/store/apps/details?id=com.kakao.talk",
                "VERIFIED_COMMERCIAL", "https://www.kakaocorp.com", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("messaging", "chat", "community", "essential"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "kr-coupang", "Coupang Rocket", "DAILY_ESSENTIALS", "KR",
                "Korea's premier e-commerce platform offering dawn delivery of groceries, home electronics, dorm supplies, and household essentials.",
                "https://www.coupang.com", "https://apps.apple.com/kr/app/coupang", "https://play.google.com/store/apps/details?id=com.coupang.mobile",
                "VERIFIED_COMMERCIAL", "https://www.coupang.com", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("shopping", "groceries", "dawn-delivery", "essentials"), true, "2026-11-01"
        ));

        // --- JAPAN ---
        APPS_REGISTRY.add(new LocalAppDto(
                "jp-suica", "Suica Digital Transit Pass", "TRANSPORT_MOBILITY", "JP",
                "Japan's nationwide contactless IC card for JR trains, Tokyo Metro, buses, and thousands of convenience stores across Japan.",
                "https://www.jreast.co.jp/e/pass/suica.html", "https://apps.apple.com/jp/app/suica", null,
                "GOVERNMENT_REGULATED", "https://www.mlit.go.jp", "AVAILABLE", true,
                new BigDecimal("20.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("transit", "suica", "metro", "ic-card", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "jp-tokyo-metro-pass", "Tokyo Metro 72-Hour Unlimited Pass", "TRANSPORT_MOBILITY", "JP",
                "Unlimited rides on all 13 Tokyo Metro and Toei Subway lines across Greater Tokyo for 72 consecutive hours.",
                "https://www.tokyometro.jp/en/ticket/travel/", null, null,
                "GOVERNMENT_REGULATED", "https://www.metro.tokyo.lg.jp", "AVAILABLE", true,
                new BigDecimal("12.00"), "USD",
                List.of("HIGHER_EDUCATION", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD"),
                List.of("metro", "tokyo", "subway", "unlimited", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "jp-japan-esim", "SoftBank & Docomo 5G Japan eSIM", "CONNECTIVITY", "JP",
                "High-speed 5G mobile data coverage throughout Japan with instant QR code activation and no physical SIM card swap.",
                "https://www.softbank.jp/en/", null, null,
                "VERIFIED_COMMERCIAL", "https://www.softbank.jp", "AVAILABLE", true,
                new BigDecimal("26.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("esim", "connectivity", "japan", "5g", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "jp-japan-travel", "Japan Travel by NAVITIME", "MAPS_NAVIGATION", "JP",
                "The most reliable navigation tool for international visitors in Japan with Shinkansen transit directions and offline route planning.",
                "https://japantravel.navitime.com", "https://apps.apple.com/app/japan-travel-by-navitime/id686373726", "https://play.google.com/store/apps/details?id=jp.co.navitime.inbound.walk",
                "VERIFIED_COMMERCIAL", "https://www.navitime.co.jp", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "EXCHANGE_PROGRAMME"),
                List.of("maps", "train", "shinkansen", "navigation"), true, "2026-11-01"
        ));

        // --- GERMANY ---
        APPS_REGISTRY.add(new LocalAppDto(
                "de-bvg-ticket", "BVG & Deutschland-Ticket Welcome Pass", "TRANSPORT_MOBILITY", "DE",
                "Unlimited public transit access across Berlin (U-Bahn, S-Bahn, trams, buses) and regional trains across Germany.",
                "https://www.bvg.de/en", "https://apps.apple.com/de/app/bvg-fahrinfo", "https://play.google.com/store/apps/details?id=de.bvg.fahrinfo",
                "GOVERNMENT_REGULATED", "https://www.berlin.de", "AVAILABLE", true,
                new BigDecimal("35.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("transit", "bvg", "ubahn", "sbahn", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "de-telekom-esim", "Telekom Germany 5G Unlimited Travel eSIM", "CONNECTIVITY", "DE",
                "Premium EU-wide roaming and high-speed German 5G connectivity powered by Deutsche Telekom.",
                "https://www.telekom.de/en", null, null,
                "VERIFIED_COMMERCIAL", "https://www.telekom.de", "AVAILABLE", true,
                new BigDecimal("25.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION", "EXCHANGE_PROGRAMME"),
                List.of("esim", "connectivity", "eu-roaming", "5g", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "de-db-navigator", "DB Navigator (Deutsche Bahn)", "TRANSPORT_MOBILITY", "DE",
                "Official Deutsche Bahn rail app for high-speed ICE trains, regional connections, and live delay notifications across Germany.",
                "https://www.bahn.com/en", "https://apps.apple.com/app/db-navigator/id343555245", "https://play.google.com/store/apps/details?id=de.hafas.android.db",
                "GOVERNMENT_REGULATED", "https://www.bahn.de", "AVAILABLE", false,
                null, null,
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "JOB_SEARCH", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("train", "ice", "rail", "intercity"), true, "2026-11-01"
        ));

        // --- SINGAPORE ---
        APPS_REGISTRY.add(new LocalAppDto(
                "sg-ezlink", "Singapore Tourist Transit Pass", "TRANSPORT_MOBILITY", "SG",
                "Contactless MRT and bus card for seamless travel across Singapore's entire public transit network.",
                "https://www.ezlink.com.sg", null, null,
                "GOVERNMENT_REGULATED", "https://www.lta.gov.sg", "AVAILABLE", true,
                new BigDecimal("22.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD"),
                List.of("mrt", "bus", "transit", "ezlink", "paypal"), true, "2026-11-01"
        ));

        APPS_REGISTRY.add(new LocalAppDto(
                "sg-singtel-esim", "Singtel 5G Singapore Tourist eSIM", "CONNECTIVITY", "SG",
                "100GB of 5G data on Singapore's fastest mobile network with 30-day validity and local call minutes.",
                "https://www.singtel.com", null, null,
                "VERIFIED_COMMERCIAL", "https://www.singtel.com", "AVAILABLE", true,
                new BigDecimal("15.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "EXCHANGE_PROGRAMME", "DIGITAL_NOMAD"),
                List.of("esim", "singapore", "5g", "connectivity", "paypal"), true, "2026-11-01"
        ));

        // --- UAE ---
        APPS_REGISTRY.add(new LocalAppDto(
                "ae-nol-card", "Dubai Metro NOL Smart Transit Card", "TRANSPORT_MOBILITY", "AE",
                "Official RTA smart card for Dubai Metro, Dubai Tram, water buses, public buses, and designated RTA parking.",
                "https://www.rta.ae", null, null,
                "OFFICIAL_GOVERNMENT", "https://www.rta.ae", "AVAILABLE", true,
                new BigDecimal("18.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("metro", "dubai", "nol", "transit", "paypal"), true, "2026-11-01"
        ));

        // --- UNITED KINGDOM ---
        APPS_REGISTRY.add(new LocalAppDto(
                "gb-oyster", "London Visitor Oyster Transit Card", "TRANSPORT_MOBILITY", "GB",
                "Pre-loaded smartcard for travel on the London Underground (Tube), Overground, Elizabeth line, and London buses.",
                "https://tfl.gov.uk", null, null,
                "GOVERNMENT_REGULATED", "https://tfl.gov.uk", "AVAILABLE", true,
                new BigDecimal("30.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("tube", "london", "oyster", "transit", "paypal"), true, "2026-11-01"
        ));

        // --- UNITED STATES ---
        APPS_REGISTRY.add(new LocalAppDto(
                "us-omny-pass", "MTA NYC Metro & AirTrain Transit Package", "TRANSPORT_MOBILITY", "US",
                "Contactless unlimited transit package for New York City Subway, local MTA buses, and JFK/Newark AirTrain connections.",
                "https://new.mta.info", null, null,
                "GOVERNMENT_REGULATED", "https://new.mta.info", "AVAILABLE", true,
                new BigDecimal("34.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("subway", "nyc", "airtrain", "omny", "paypal"), true, "2026-11-01"
        ));

        // --- INDIA ---
        APPS_REGISTRY.add(new LocalAppDto(
                "in-airtel-esim", "Airtel 5G India Travel eSIM", "CONNECTIVITY", "IN",
                "Nationwide high-speed 5G connectivity, unlimited local calls, and 2GB daily data for arrivals in India.",
                "https://www.airtel.in", null, null,
                "VERIFIED_COMMERCIAL", "https://www.airtel.in", "AVAILABLE", true,
                new BigDecimal("12.00"), "USD",
                List.of("HIGHER_EDUCATION", "EMPLOYMENT", "TOURISM", "BUSINESS", "DIGITAL_NOMAD", "PERMANENT_RELOCATION"),
                List.of("esim", "connectivity", "india", "airtel", "paypal"), true, "2026-11-01"
        ));
    }

    @GetMapping("/apps")
    public ResponseEntity<List<LocalAppDto>> getApps(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String purpose,
            @RequestParam(required = false) String category
    ) {
        List<LocalAppDto> results = APPS_REGISTRY.stream()
                .filter(app -> country == null || app.countryCode().equalsIgnoreCase(country))
                .filter(app -> purpose == null || app.supportedPurposes().contains(purpose.toUpperCase()))
                .filter(app -> category == null || app.category().equalsIgnoreCase(category))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}

