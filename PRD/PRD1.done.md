# 제품 요구사항 문서 (PRD1)

## 기능명

**Riot ID 입력 및 전적 검색 요청 모듈**

---

## 1. 개요

이 모듈은 `GGR`의 가장 핵심이자 첫 번째 사용자 진입점으로,  
사용자가 **Riot ID(GameName#TagLine)를 입력하면 Riot API를 통해 해당 플레이어의 기본 전적 데이터를 요청**하는 기능을 담당한다.  
입력-검색-결과조회 흐름 중 “입력 및 요청” 단계를 완성하는 것을 목표로 한다.

---

## 2. 목적 및 필요성

- 전체 서비스의 시작점으로, 올바른 사용자 입력을 통해만 데이터 요청 가능
- 단순하지만 사용자 경험(UX)에 큰 영향을 주는 핵심 진입 기능
- 빠르고 명확한 입력/검증 프로세스 확보가 필수적임

---

## 3. 목표

- **입력 후 1초 이내에 Riot API 호출 시작**
- **유효하지 않은 닉네임 입력 시 명확한 오류 메시지 제공**
- **최근 검색 자동저장 (localStorage 기반)**

---

## 4. 사용자 시나리오

1. 사용자가 사이트 접속
2. 중앙 입력창에 자신의 **Riot ID(GameName#TagLine)** 입력
3. Enter 또는 검색 버튼 클릭
4. 올바른 아이디일 경우 Riot API 호출 → 다음 단계(전적 표시 페이지)로 이동
5. 존재하지 않거나 입력 오류 시 에러 메시지 노출 (“해당 소환사를 찾을 수 없습니다.”)
6. 입력값은 localStorage에 저장되어, 다음 방문 시 자동 완성 제안

---

## 5. 기능 요구사항

### ✅ 핵심 기능

1. **입력 필드 구성**

   - 단일 텍스트 인풋 (Riot ID 입력용, 예: "MyGameName#KR1")
   - 입력 감지 시 placeholder 애니메이션 (UX 개선)

2. **API 요청 트리거**

   - 입력 후 검색 버튼 클릭 or Enter 키 입력 시 `GET` 요청 수행
   - **1차: Riot ID로 `puuid` 조회**
     - Riot API 엔드포인트
       ```
       /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
       ```
   - **2차: `puuid`로 소환사 정보 조회**
     - Riot API 엔드포인트
       ```
       /lol/summoner/v4/summoners/by-puuid/{puuid}
       ```
   - 응답 성공 시 소환사 정보(JSON) 반환

3. **에러 핸들링**

   - 404 → “존재하지 않는 소환사입니다.”
   - 403 → “API Key 오류. 관리자에게 문의하세요.”
   - 429 → “요청이 너무 많습니다. 잠시 후 다시 시도해주세요.”

4. **최근 검색 기능**
   - 최대 5개의 소환사명 로컬 저장
   - 최근 검색 리스트 클릭 시 자동 입력

---

## 6. UI/UX 요구사항

- 중앙 정렬된 **Search Input Box**
- **자동 완성(dropdown)**: 최근 검색 목록 표시
- **로딩 상태 표시**: 검색 중 스피너 애니메이션
- **에러 메시지 영역**: 붉은 색으로 하단 출력

---

## 7. 기술 요구사항

- **Framework:** Next.js 15 (App Router 기반)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **API 관리:** fetch + Riot API
- **캐싱:** localStorage

## 8. 향후 확장 계획

- **자동완성 API 연동 (예: 추천 소환사명)**
- **지역(region) 자동 감지 기능 추가 (KR, NA 등)**
- **모바일 UI 최적화**

---

## 9. 참고 API 문서

- [Account V1 API](https://developer.riotgames.com/apis#account-v1)
- [Summoner V4 API](https://developer.riotgames.com/apis#summoner-v4)

---

## 🚀 PRD1 최종 점검 (Gemini Agent 작업 결과)

### ✅ 완료된 요구사항

- **기능명:** Riot ID 입력 및 전적 검색 요청 모듈
- **목표:**
  - 입력 후 즉시 Riot API 호출 시작
  - 유효하지 않은 Riot ID 입력 시 명확한 오류 메시지 제공
- **사용자 시나리오:**
  - 사이트 접속, Riot ID 입력, 검색 버튼/Enter 클릭, API 호출, 오류 메시지 표시
- **기능 요구사항:**
  - **입력 필드 구성:** 단일 텍스트 인풋 (Riot ID 입력용, 예: "MyGameName#KR1")
  - **API 요청 트리거:**
    - 검색 버튼/Enter 클릭 시 GET 요청 수행
    - 1차: Riot ID로 `puuid` 조회 (`account-v1` API 사용)
    - 2차: `puuid`로 소환사 정보 조회 (`summoner-v4` API 사용)
    - 응답 성공 시 소환사 정보(JSON) 반환
  - **에러 핸들링:** 404, 403, 429 등 Riot API 오류 처리 및 메시지 표시
- **UI/UX 요구사항:**
  - 중앙 정렬된 Search Input Box
  - 로딩 상태 표시 (스피너 애니메이션)
  - 에러 메시지 영역 (붉은 색으로 하단 출력)
  - **최근 검색 기능:**
    - 최대 5개의 Riot ID 로컬 저장 (`localStorage` 기반)
    - 최근 검색 리스트 클릭 시 자동 입력 및 검색
    - 자동 완성(dropdown) UI로 최근 검색 목록 표시

### ⚠️ 미완료된 요구사항 (향후 개선 가능)

- **입력 필드 구성:** 입력 감지 시 placeholder 애니메이션 (UX 개선)

---
