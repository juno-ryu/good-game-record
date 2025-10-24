# 제품 요구사항 문서 (PRD3)

## 기능명

**UI/UX 개선 및 인터랙션 고도화 (OP.GG 스타일 전적 카드 뷰)**

## 1. 개요

PRD3는 GGR의 핵심 사용자 경험을 향상시키는 단계로,  
이전 단계(PRD1 입력 / PRD2 전적 표시)를 기반으로 한 **UI/UX 완성도 향상 스프린트**이다.  
사용자가 전적을 확인할 때 시각적으로 깔끔하고 몰입감 있는 인터페이스를 제공하여,

## 2. 목표

기능 중심 MVP에서 **디자인 완성형 제품 수준**으로 발전시키는 것을 목표로 한다.

## 3. 구현된 UI/UX 개선 사항

### 3.1. 소환사 프로필 컴포넌트 (`shared/components/summoner-profile.tsx`)

- **태그라인 표시:** 소환사 이름 옆에 태그라인(`tagLine`)을 추가하여 소환사 정보를 더욱 풍부하게 제공합니다.
- **시각적 강조:** 소환사 이름 앞에 회색 별 아이콘을 추가하여 시각적인 포인트를 줍니다.

### 3.2. 매치 요약 컴포넌트 (`shared/components/match-history/match-summary.tsx`)

- **원형 그래프 개선:**
  - 기존의 커스텀 CSS 기반 원형 그래프를 `react-circular-progressbar` 라이브러리로 교체하여 더 유연하고 깔끔한 구현을 제공합니다.
  - 제공된 이미지(`win-late.png`)를 참고하여 승률을 보라색/회색 색상으로 표시하고, 원형 그래프 내부에 "승률" 텍스트를 포함하도록 스타일을 조정했습니다.
- **레이아웃 및 정보 표시:**
  - 상단에 총 게임 수, 승리, 패배를 "XG YW ZL" 형식으로 표시합니다.
  - 원형 그래프 오른쪽에 평균 킬, 데스, 어시스트, 평균 KDA, 킬 관여율을 이미지와 동일한 레이아웃 및 스타일로 표시합니다.
- **데이터 계산 로직 개선 (`shared/store/match-store.ts`):**
  - `MatchSummary` 인터페이스에 `averageKills`, `averageDeaths`, `averageAssists`, `killParticipation` 필드를 추가했습니다.
  - `fetchMatches` 함수 내에서 각 매치에 대한 팀 킬 수를 기반으로 `killParticipation`을 포함한 모든 새로운 요약 통계를 정확하게 계산하도록 로직을 업데이트했습니다.
  - `ParticipantDetail` 인터페이스에 `teamId`를 추가하고, `app/api/matches/[puuid]/route.ts`에서 `teamId`를 포함하여 전달하도록 수정하여 `killParticipation` 계산의 정확성을 확보했습니다.

### 3.3. 매치 상세 모달 (`shared/components/match-history/match-detail-modal.tsx`)

- **참가자 상세 정보:** 각 참가자에 대해 `totalMinionsKilled` (CS), `goldEarned` (획득 골드), `totalDamageDealtToChampions` (챔피언에게 가한 피해량) 정보를 추가로 표시합니다.
- **소환사 이름 표시:** 각 참가자의 소환사 이름(`summonerName`)이 명확하게 표시되도록 합니다.

### 3.4. 전반적인 레이아웃 및 반응형 개선 (`app/page.tsx`)

-   **타이틀 아이콘:** "GGR" 타이틀 옆에 `lucide-react`의 `Gamepad` 아이콘을 추가하고, 타이틀을 가로 중앙에 정렬하여 시각적 완성도를 높였습니다.
-   **검색 입력 필드 너비 조정:** 소환사 검색 정보 유무에 따라 검색 입력 필드의 너비를 조건부로 조정하여, 정보가 없을 때는 `max-w-md`로 좁게, 정보가 있을 때는 `w-full`로 확장되도록 했습니다.
-   **메인 콘텐츠 레이아웃:** 메인 콘텐츠 영역을 3:7 비율의 flex 레이아웃으로 재구성했습니다. 왼쪽 컬럼에는 `SummonerProfile`, `MatchSummary`, `ChampionSummary`를, 오른쪽 컬럼에는 `MatchList`를 배치했습니다.
-   **반응형 패딩:** 메인 컨테이너의 패딩을 모바일(`p-4`)과 데스크톱(`md:p-24`)에 따라 반응형으로 조정하여 모든 기기에서 적절한 간격을 유지하도록 했습니다.

## 4. 향후 예정 작업

-   **게임 상세 정보 UI 변경:** 현재 모달 형태로 제공되는 게임 상세 정보를 아코디언(Accordion) UI로 변경하여 사용자 경험을 개선하고 정보 접근성을 높일 예정입니다.