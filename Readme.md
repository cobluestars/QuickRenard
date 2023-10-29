![QuickRenard Logo](https://github.com/cobluestars/QuickRenard/blob/main/public/QuickRenard.png?raw=true)

# QuickRenard
 "\"Quick Renard (QR) - A state management library for React, inspired by FraphQL principles, offering a flexible querying and mutation system.\""

🦊Quick Renard🦊

GraphQL의 원리를 차용하여 React의 props나 상태를 관리하는 라이브러리 🦊Quick Renard🦊를 제작했습니다.

Quick Renard는 전역 상태 저장소를 통해 상태를 중앙에서 관리하면서,
스키마를 통한 유효성 검사와 구독 기반의 상태 변화 알림 메커니즘을 제공하여, 
React 애플리케이션의 상태 관리를 간편하고 효과적으로 수행할 수 있게 도와주는 도구입니다.

1. 정의 및 설계
쿼리 기반의 상태 정의: 각 상태를 GraphQL 스키마처럼 정의합니다. 예를 들어, 상태의 타입, 초기 값, 의존성 등을 명시적으로 표현합니다.
쿼리 및 변이 작성: 사용자가 상태를 조회하거나 수정할 수 있도록 쿼리와 변이를 제공합니다.

2. 라이브러리 구현
상태 저장소: 모든 상태를 저장하는 중앙 저장소를 만듭니다.
쿼리 해석기: 주어진 쿼리를 해석하고 해당하는 상태를 반환하는 로직을 구현합니다.
변이(Mutation) 처리기: 주어진 변이(Mutation)를 해석하고 상태를 업데이트하는 로직을 구현합니다.
구독(subscription) 메커니즘: 특정 상태의 변이를 구독하고, 변이가 감지되면 콜백을 실행하는 메커니즘을 구현합니다.

3. React Hooks

useStateQuery: 주어진 쿼리에 해당하는 상태를 반환하는 Hook을 제공합니다.
useStateMutation: 주어진 변이를 실행하는 함수와 상태를 반환하는 Hook을 제공합니다.
useStateSubscription: 주어진 상태의 변화를 구독하고, 변화가 감지되면 컴포넌트를 리렌더링하는 Hook을 제공합니다.


사용자는 쿼리와 변이를 사용하여 상태에 쉽게 접근하고 수정할 수 있으며, 
필요한 상태의 변화만을 구독하여 컴포넌트를 리렌더링할 수 있게 됩니다.


1. 상태 저장소 (stateStore):

Quick Renard 라이브러리에서는 전역적으로 관리되는 stateStore라는 중앙 저장소를 통해 상태를 관리합니다. 

이 저장소에는 애플리케이션의 모든 상태가 저장되며, 
쿼리 기반의 접근 방식을 사용하여 특정 상태를 검색하거나 수정할 수 있습니다.

2. 상태 스키마 (StateSchema):

상태의 구조와 기대되는 타입, 기본값 등을 정의하기 위해 스키마를 사용합니다.
이를 통해 상태의 초기 설정을 쉽게 할 수 있으며, 상태 변경 시 유효성 검사의 기준으로 사용됩니다.

3. 상태 변이 (setStateMutation):

이 함수를 통해 상태를 수정하게 됩니다.
함수 내부에서는 스키마를 바탕으로 상태의 유효성 검사를 수행할 수 있으며,
해당 상태에 변화가 있을 경우, 그 상태를 구독하고 있는 모든 구독자들에게 알림을 보냅니다.

4. 상태 구독 (subscribeStateChange):

특정 상태의 변화를 관찰하고자 하는 컴포넌트는 이 함수를 통해 해당 상태의 변화를 구독합니다. 
상태가 변경될 때마다 구독하고 있는 컴포넌트는 콜백 함수를 실행하게 됩니다. 
이를 통해 상태 변화에 따른 리렌더링이나 다른 작업을 수행할 수 있습니다.


요약:
1. props나 상태를 쿼리화하여 statestore에 저장해서 전역으로 관리하고,
2. 스키마를 사용해 props와 상태의 구조와 타입을 정의하고,
3. setStateMutation같은 함수에서 유효성 검사를 수행하고 초기 상태를 설정하며, 
4. setStateSubscription을 이용해 props나 상태를 사용하길 원하는 컴포넌트에서 구독해서 사용
