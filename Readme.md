![QuickRenard Logo](https://github.com/cobluestars/QuickRenard/blob/main/public/QuickRenard.png?raw=true)

# 🦊quickrenard🦊

<p> GraphQL의 원리를 일부 차용하여,</p>
<p> React의 상태(State)와 함수를 관리하는 라이브러리 </p>
<br />

## 🦊Quick Renard를 제작했습니다.🦊

<p> Quick Renard는 전역 상태 저장소를 통해 상태를 중앙에서 관리하면서, </p>
<p> 스키마를 통한 유효성 검사와 구독 기반의 상태 변화 알림 메커니즘을 제공하여,</p> 
<p> React의 상태 관리를 간편하고 효과적으로 수행할 수 있게 도와주는 도구입니다. </p>

<br />
<hr />
<br />

### 1. 정의 및 설계
1. 쿼리 기반의 상태 정의: 각 상태를 GraphQL 스키마처럼 정의합니다. 예를 들어, 상태의 타입, 초기 값, 의존성 등을 명시적으로 표현합니다.
2. 쿼리 및 변이 작성: 사용자가 상태를 조회하거나 수정할 수 있도록 쿼리와 변이를 제공합니다.

### 2. 라이브러리 구현
1. 상태 저장소: 모든 상태를 저장하는 중앙 저장소를 만듭니다.
2. 쿼리 해석기: 주어진 쿼리를 해석하고 해당하는 상태를 반환하는 로직을 구현합니다.
3. 변이(Mutation) 처리기: 주어진 변이(Mutation)를 해석하고 상태를 업데이트하는 로직을 구현합니다.
4. 구독(subscription) 메커니즘: 특정 상태의 변이를 구독(subscription)하고, 변이가 감지되면 콜백을 실행하는 메커니즘을 구현합니다.

### 3. React Hooks
1. useStateQuery: 주어진 쿼리에 해당하는 상태를 반환하는 Hook을 제공합니다.
2. useStateMutation: 주어진 변이를 실행하는 함수와 상태를 반환하는 Hook을 제공합니다.
3. useStateSubscription: 주어진 상태의 변화를 구독하고, 변화가 감지되면 컴포넌트를 리렌더링하는 Hook을 제공합니다.

<br />

- 사용자는 쿼리와 변이를 사용하여 상태에 쉽게 접근하고 수정할 수 있으며,
- 필요한 상태의 변화만을 구독하여 컴포넌트를 리렌더링할 수 있게 됩니다.

<br />

### 1. 상태 저장소 (stateStore):

- Quick Renard 라이브러리에서는 전역적으로 관리되는 stateStore라는 중앙 저장소를 통해 상태를 관리합니다. 이 저장소에는 애플리케이션의 모든 상태가 저장되며, 
쿼리 기반의 접근 방식을 사용하여 특정 상태를 검색하거나 수정할 수 있습니다.

### 2. 상태 스키마 (StateSchema):

- 상태의 구조와 기대되는 타입, 기본값 등을 정의하기 위해 스키마를 사용합니다. 이를 통해 상태의 초기 설정을 쉽게 할 수 있으며, 상태 변경 시 유효성 검사의 기준으로 사용됩니다.

### 3. 상태 변이 (setStateMutation):

- 이 함수를 통해 상태를 수정하게 됩니다. 함수 내부에서는 스키마를 바탕으로 상태의 유효성 검사를 수행할 수 있으며, 해당 상태에 변화가 있을 경우, 그 상태를 구독하고 있는 모든 구독자들에게 알림을 보냅니다.

### 4. 상태 구독 (subscribeStateChange):

- 특정 상태의 변화를 관찰하고자 하는 컴포넌트는 이 함수를 통해 해당 상태의 변화를 구독합니다. 상태가 변경될 때마다 구독하고 있는 컴포넌트는 콜백 함수를 실행하게 됩니다. 
이를 통해 상태 변화에 따른 리렌더링이나 다른 작업을 수행할 수 있습니다.

<br />
<br />

## 🦊Ver 1.2.0🦊

## 타입 검증 로직 추가

<br />

### 1. Enum 검증:

- enum 키를 통해 허용된 문자열 집합을 정의할 수 있습니다.
- 해당 값이 enum에 정의된 문자열 중 하나인지 검사합니다.
- 예를 들어, 상태가 특정 문자열 값들 중 하나만 가져야 할 경우 사용됩니다.

### 2. 객체 속성 검증:

- properties 키를 통해 객체의 각 속성에 대한 스키마를 정의할 수 있습니다.
- 각 속성의 유형을 검사하여 해당 속성이 올바른 유형인지 확인합니다.
- 객체 내부의 각 속성이 정의된 스키마를 따르는지 검사하기 위해 사용됩니다.

### 3. 배열 항목 타입 검증:

- 배열의 모든 항목이 해당 스키마를 준수하는지 검사합니다.
- 배열 내부의 각 항목이 정의된 스키마를 따르는지 검사하기 위해 사용됩니다.

<br />
<hr />
<br />

## 🦊Ver 2.0.0🦊

## 함수 전역 관리소 functionStore 추가

<br />

### 1. 관리할 수 있는 대표적인 함수 유형:

- 순수 함수: 동일한 인자에 대해 항상 동일한 결과를 반환하고, 외부 상태를 변경하지 않는 함수입니다.
 
- 유틸리티 함수: 문자열 처리, 날짜 계산, 숫자 포맷팅 등 재사용 가능한 기능을 제공합니다.
 
- 헬퍼 함수: 반복적으로 사용되는 로직을 추상화한 함수입니다 (예: API 요청).
 
### 2. 위와 같은 함수들을 관리할 수 있으나, 주의가 필요합니다:
 
- 사이드 이펙트: 함수가 외부 시스템의 상태에 영향을 주거나 그로부터 영향을 받는 경우,
(예시: 데이터베이스에 접근하거나 외부 API를 호출하는 함수) 예측하지 못한 결과를 초래할 수 있습니다.
 
- 상태 의존성: 함수가 내부 상태에 의존하는 경우, 그 상태의 변화가 함수의 결과에 영향을 줄 수 있습니다.
 
- 스코프와 클로저: 함수가 특정 스코프의 변수를 사용하는 경우, 이러한 의존성을 관리해야 합니다.

- 동시성 제어: 여러 구독자가 동일한 함수의 결과를 구독할 때 발생하는 동시성 이슈를 관리해야 합니다.

- p.s: QuickRenard 2.1.0 버전에서는 함수 호출에 대응하는 구독과 구독 취소 과정이 라이브러리 내부적으로 자동으로 관리되도록 개선하였습니다. 간단히 말해, QuickRenard가 구독과 구독 취소의 세세한 관리를 자동화함으로써, 개발자는 함수 등록 및 호출에 집중할 수 있으며, 더 안정적이고 유지보수가 쉬운 코드를 작성할 수 있을 것입니다.

### functionStore를 사용하려면, 아래의 !!! How to use !!! 를 참조하세요.

<br />
<hr />
<br />

## 🦊Ver 2.3.0 - Ver 2.5.0🦊

## 상태 캐싱 로직 추가:

<br />

### 성능 최적화를 위한 새로운 기능:
1. 상태 캐싱을 통해, 자주 접근하는 상태에 대한 신속한 검색이 가능합니다. 라이브러리 사용 시, 성능이 전반적으로 개선될 것입니다.

2. 이전에 요청된 상태 값을 캐시에 저장합니다. 같은 상태를 다시 요청할 때 신속한 응답을 받을 수 있습니다. 복잡한 계산 혹은 데이터베이스 쿼리가 필요한 상태의 경우, 특히 이 기능은 유용할 것입니다.

3. 네트워크 지연, 서버 과부하를 예방하는 데에 효과적입니다. 원격 데이터를 상태로 관리하는 경우, 캐싱은 네트워크 요청 수를 줄임으로써, 데이터 전송을 효율적으로 수행할 수 있습니다.

### 캐싱 관련 주의사항:
1. 캐시는 메모리 관리를 위해, 디폴트 값으로 15분 뒤에 만료됩니다.

2. Ver 2.5.0부터 캐시 만료 시간을 임의로 조정할 수 있습니다. 방법 및 주의사항은 ❗❗❗ How to use ❗❗❗를 참조하세요.

### 업데이트를 통해 QuickRenard는 애플리케이션의 성능을 개선하고, 보다 효율적으로 상태 관리를 할 수 있도록 지원합니다. Ver 2.3.0 업데이트는 특히 대규모 애플리케이션 및 데이터 집약적 작업에 중점을 두고 진행했습니다.

<br />
<hr />
<br />

## 🦊Ver 2.6.0 - Ver 2.7.0🦊

- 상태 관리 시스템이 더욱 강력해졌습니다. 이제 상태 간의 복잡한 종속성을 그래프 탐색 알고리즘으로 효과적으로 관리할 수 있습니다. DFS(깊이 우선 탐색)와 BFS(너비 우선 탐색) 알고리즘을 활용하여, 상태의 업데이트가 다른 상태에 미치는 영향을 효과적으로 처리합니다.

1. DFS(깊이 우선 탐색): 깊게 연결된 상태 간의 종속성을 탐색합니다. 이 방식은 상태 간에 깊은 연결이 있는 경우에 적합합니다.
2. BFS(너비 우선 탐색): 넓은 범위의 상태 간의 종속성을 탐색합니다. 이 방식은 더 넓은 범위의 상태 간 영향을 관리할 때 유용합니다.
3. Ver 2.7.0부터는 상태 간의 종속성을 관리할 시, updateState함수가 DFS로 처리할지, BFS로 처리할지 자동으로 판별해 줍니다. 이를 통해 상태 관리가 더욱 유연하고 효율적으로 이루어집니다.

### DFS 또는 BFS 관련 설정을 사용하려면, 아래의 ❗❗❗ How to use ❗❗❗ 를 참조하세요.

<br />
<hr />
<br />

## 🦊Ver 2.7.1 - 🦊

- Lodash로부터 독립했습니다.

<br />
<hr />
<br />

## 🦊Ver 2.8.1 - 🦊

 - 상태 관리 훅의 강화 및 기능 확장

### 주요 변경 사항:

1. useStateQuery 개선: Ver 2.8.0에서 useStateQuery는 상태의 로딩 및 에러 처리를 보다 효과적으로 관리합니다. 반환 객체에는 data 필드 외에도 loading 및 error 필드가 포함되어 있어, 상태 로딩의 진행 상황과 발생할 수 있는 에러를 쉽게 추적할 수 있습니다. 이러한 추가 필드는 상태 조회 과정에서의 다양한 상황들을 애플리케이션 내에서 세심하게 처리할 수 있게 해주어, 더 강력하고 유연한 상태 관리가 가능합니다.

2. useStateMutation 확장: 상태 변경 로직이 비동기적으로 처리될 수 있도록 useStateMutation이 개선되었습니다. 상태 변경 시 로딩 상태와 오류 처리를 관리할 수 있는 기능이 추가되었으며, 이는 API 호출과 같은 비동기 작업에 매우 유용합니다. 사용자는 상태 변경 함수(mutate), 현재 상태(state), 로딩 상태(loading), 그리고 발생한 오류(error)를 쉽게 관리할 수 있습니다.

3. useStateSubscription의 상태 변화 감지 개선: 상태 변화를 더 정교하게 감지할 수 있도록 useStateSubscription을 개선했습니다. 이제 콜백 함수가 최신 상태로 유지되면서, 상태 변화를 보다 정확하게 감지하고 반응합니다.

4. 타입스크립트 지원 강화: hooks.d.ts 파일을 통해 모든 훅의 타입스크립트 정의를 보완했습니다. useStateQuery와 useStateMutation은 각각 StateQueryResult<T> 및 StateMutationResult<T> 인터페이스를 사용하여 반환 타입을 명확히 정의합니다. 이러한 타입 정의는 개발자들이 훅을 더 정확하고 안전하게 사용할 수 있도록 돕습니다.

5. updateState 함수의 비동기 처리 강화: updateState 함수는 이제 상태를 비동기적으로 업데이트할 수 있는 기능을 갖추었습니다. 이 함수는 상태 변경과 함께, 해당 상태에 종속된 모든 상태들도 적절한 탐색 전략 (DFS 또는 BFS)을 사용하여 업데이트합니다. 이 변화는 다음과 같은 이점을 제공합니다:

5-1. 비동기 상태 관리: updateState 함수는 Promise를 반환하므로, 상태 업데이트 작업의 완료를 비동기적으로 기다릴 수 있습니다. 이는 API 호출과 같은 외부 비동기 작업을 통합하는 데 특히 유용합니다.

5-2. 종속 상태 업데이트: 상태 간의 종속성을 고려하여, 한 상태의 업데이트가 종속된 다른 상태들에도 자동으로 반영됩니다. 이를 통해 복잡한 상태 간의 관계를 쉽게 관리할 수 있습니다.

5-3. DFS 및 BFS 전략: 상태 업데이트 전략은 상태 간의 관계에 따라 DFS(깊이 우선 탐색) 또는 BFS(너비 우선 탐색)로 결정됩니다. 이는 상태 구조에 따라 최적의 업데이트 전략을 선택하여 효율적으로 상태를 관리할 수 있게 합니다.

이번 업데이트는 상태 관리에 있어 비동기 작업의 통합, 복잡한 상태 관계의 관리, 그리고 상태 업데이트 전략의 최적화를 지원함으로써, 애플리케이션의 상태 관리를 더욱 강력하고 유연하게 만들 것입니다. 이러한 개선은 특히 외부 데이터 소스와의 상호작용 및 복잡한 상태 종속성을 다룰 때 그 효과를 발휘할 것입니다.

<br />
<br />

# ❗❗❗ How to use ❗❗❗

<br />

# 🦊 quickrenard 🦊
## : A Simple State Management in React

QuickRenard(quickrenard) is a lightweight state management solution for React applications. By providing clear paths for data querying, mutation, and subscriptions, QuickRenard streamlines the state-sharing process between components, even if they aren't directly related in the component tree.

<br />
<br />

## Setup and Initialization

To start using quickrenard, you first need to define a schema for your state and then initialize the store.

### 1. Define State Schema:

Your state is structured based on a schema. This schema outlines the shape, type, and default values of your state properties.

```javascript
// stateSchema.js
export const stateSchema = {
    'childData.data': {
        type: 'string',
        defaultValue: 'initialValue'
    }
};
```

### 2. Initialize Store:
Once you have your schema in place, initialize the state store with it. This sets up the initial state for your application.

```javascript
// stateStore.js
import { initializeStore } from 'quickrenard';
import { stateSchema } from './stateSchema';

initializeStore(stateSchema);
```

### 3. Using quickrenard in Components

#### Querying State:
To access a state property within a component, use the useStateQuery hook. This hook queries and retrieves the value of the specified state property.

```javascript
const data = useStateQuery("childData.data");
```

#### Mutating State:
For updating the state, use the useStateMutation hook. This hook provides a function to update a specific state property and also returns the current value of that property.


```javascript
const [updateChildData, data] = useStateMutation("childData.data");
```

#### Subscribing to State Changes:
If you want a component to react to changes in the state, use the useStateSubscription hook. It allows you to provide a callback function that will be called whenever the specified state property changes.

```javascript
useStateSubscription("childData.data", handleDataChange);
```

## Example: Sharing State Between Distant Components
Consider a scenario where you have two components, Child and Cousin, that aren't directly related in the component tree. Yet, you want to share state data between them using QuickRenard.

<br />

### Child Component:
This component mutates the data.

```javascript
// Child.js
import React from 'react';
import { useStateMutation } from 'quickrenard';

function Child() {
  const [updateChildData, data] = useStateMutation("childData.data");

  const handleUpdateData = () => {
    updateChildData("Updated Data from Child");
    console.log("Data updated!");
  };

  return (
    <div>
      <h3>Child Component</h3>
      <p>Data: {data}</p>
      <button onClick={handleUpdateData}>Update Data</button>
    </div>
  );
}
```

### Cousin Component:
This component queries the data and subscribes to its changes.

```javascript
// Cousin.js
import React from 'react';
import { useStateQuery, useStateSubscription } from 'quickrenard';

function Cousin() {
  const data = useStateQuery("childData.data");

  const handleDataChange = () => {
    console.log("Child data has changed!");
  };

  useStateSubscription("childData.data", handleDataChange);

  return (
    <div>
      <h3>Cousin Component</h3>
      <p>Data from Child: {data}</p>
    </div>
  );
}
```

With quickrenard, even if Child and Cousin aren't directly related, the state update in Child will trigger a subscription callback in Cousin, allowing seamless state sharing across different parts of your React application.

<br />
<br />

## 🦊Ver 1.2.0🦊

### Added type validation logic.

1. Enum validation:

- You can define an allowed set of string values through the enum key.
- It checks if the value is one of the strings defined in the enum.
- This is used when the state should only have one of specific string values.

2. Object property validation:

- You can define a schema for each property of the object using the properties key.
- It verifies the type of each property to ensure it's of the correct type.
- It's used to check if each property within the object adheres to the defined schema.

3. Array item type validation:

- It checks if all items in the array adhere to the specified schema.
- This is used to verify if each item inside the array follows the defined schema.

<br />
<br />

## 🦊Version 2.0.0🦊

### Global function management feature 'functionStore' added

### 1. List of representative function types that can be managed:

- Pure Functions: Functions that always return the same result for the same arguments without changing external state.

- Utility Functions: Functions that provide reusable functionalities such as string processing, date calculations, number formatting, etc.

- Helper Functions: Functions that abstract commonly used logic throughout the application (e.g., API requests).

### 2. While this function store can effectively manage the above types of functions, the following precautions are necessary:

- Side Effects: Functions that affect or are affected by the state of external systems,
 (such as accessing a database or calling external APIs) can lead to unpredictable results.

- State Dependency: Functions that depend on internal state may have results that are affected by changes to that state.

- Scope and Closures: Functions that use variables from a specific scope need to have these dependencies managed.

- Concurrency Control: Issues of concurrency that arise when multiple subscribers subscribe to the results of the same function must be managed.

<br />
<br />

## 🦊 Ver 2.1.0: State & Function Management in React 🦊

QuickRenard is your go-to library for streamlined global state and function management within React applications. The latest update, version 2.0.0, introduces a game-changing feature: the functionStore. This new capability complements the existing state management tools, enabling developers to create, invoke, and listen to global functions throughout their component hierarchy. It simplifies the management of cross-component logic and reduces the complexity of prop drilling.

<br />
<hr />
<br />

## 🦊 What's New in Version 2.1.0 🦊

- FunctionStore: A global registry for functions to be accessed and executed across components.
- Function Invocation: Call any registered global function from anywhere within your app.
- Function Subscriptions: Set up listeners for function calls to manage side effects or perform cleanup tasks.
- Enhanced Code Maintainability: Abstract common logic into globally accessible functions, leading to cleaner and more maintainable codebases.

### 🦊 Quick Start with QuickRenard's Function Store 🦊

- Step 1: Import function management APIs from QuickRenard.

```javascript
import { registerFunction, callFunction } from 'quickrenard';
```

- Step 2: Register functions that can be globally accessed.

```javascript
registerFunction('logActivity', message => console.log(`Activity: ${message}`));
```

- Step 3: Invoke registered functions from any component, passing required arguments.

```javascript
callFunction('logActivity', 'User logged in');
```

- Step 4: Set up subscriptions if you want components to react to function invocations.

```javascript
// This part of the API is now internally managed by QuickRenard, no need for manual subscription.
```

- Step 5: Unsubscribe from functions to clean up listeners.

```javascript
// This is also managed internally when components unmount or when you stop using the function in QuickRenard.
```

- QuickRenard version 2.0.0 makes your components more independent and your application more scalable by providing a central hub for state and function management.

<br />

## 🦊Practical Examples with QuickRenard🦊

### Example: Inter-Component Communication with State and Functions

- Let's look at how components like Child and Cousin can interact through shared state and functions without direct lineage or prop drilling.

### 1. Child Component:

- Here, Child updates shared state and provides a function for others to call.

```javascript
// Child.js
import React from 'react';
import { useStateMutation, registerFunction } from 'quickrenard';

function Child() {
  const [setChildData, childData] = useStateMutation("childData.data");

  const handleUpdateData = () => {
    setChildData("Updated Data from Child");
    console.log("Child data updated.");
  };  

  // Register a function for others to invoke
  registerFunction('childFunction', message => {
    console.log("Child received a message:", message);
    return "Message processed by Child";
  });

  return (
    <div>
      <h3>Child Component</h3>
      <p>Data: {childData}</p>
      <button onClick={handleUpdateData}>Update Data</button>
    </div>
  );
}

export default Child;
```

### 2. Cousin Component:

- Cousin listens for state changes and can invoke Child's function.

```javascript
// Cousin.js
import React, { useEffect } from 'react';
import { useStateQuery, useStateSubscription, callFunction } from 'quickrenard';

function Cousin() {
  const childData = useStateQuery("childData.data");

  useStateSubscription('childData.data', () => {
    console.log("Child data has changed!");
    // Invoke the function registered by Child
    try {
      const response = callFunction('childFunction', 'Hello World! - from Cousin');
      console.log('Response from Child:', response);
    } catch (error) {
      console.error(error.message);
    }
  });

  useEffect(() => {
    // This will run once when the component mounts
    console.log('Cousin mounted. Initial data:', childData);
  }, []); // Empty dependency array to mimic componentDidMount behavior

  return (
    <div>
      <h3>Cousin Component</h3>
      <p>Data from Child: {childData}</p>
    </div>
  );
}

export default Cousin;
```

<br />
<br />

## 🦊Ver 2.3.0 - Ver 2.5.0🦊

### Added State Caching Logic:

1. New Features for Performance Optimization: State caching enables swift retrieval of frequently accessed states, leading to overall performance improvements when using the library.

2. Previously requested state values are stored in the cache. This allows for quick responses when the same state is requested again. This feature is especially beneficial for states that require complex calculations or database queries.

3. It is effective in preventing network delays and server overloads. When managing remote data as state, caching can reduce the number of network requests, making data transfer more efficient.

### Cautions Related to Caching:

1. To manage memory, the cache expires after 15 minutes(default).

2. From Ver 2.5.0 onwards, you can adjust the cache expiration time at your discretion. For the method and precautions, please refer to the following.

3. Caution: The getCacheObject function exposes the library's internal state to the outside. This function should be used for development and debugging purposes only. Modifying the cache object externally can lead to unexpected issues in the library. Instead of directly altering the cache object, please use the APIs provided by the library to change the state. While it is possible to read and monitor the contents of the cache object, altering it is not recommended.

```javascript
// Example of using quickrenard
import { initializeStore, getCacheObject, subscribeStateChange } from 'quickrenard';
import { stateSchema } from './stateSchema';

// Example: Set cache expiration time to 30 minutes
initializeStore(stateSchema, { cacheExpirationTime: 1800000 });

/** 🦊Optional Usage Example🦊: Function for cache expiration countdown */

// Function for cache expiration countdown
function cacheExpirationCountdown() {
  // Get the current time
  const now = performance.now();

  // Access the cache object
  const cache = getCacheObject();

  console.clear();
  console.log("Cache Expiration Countdown:");

  // Iterate through each cache key and display the remaining time
  Object.keys(cache).forEach(key => {
    const record = cache[key];
    if (record) {
      const remainingTime = record.expirationTime - now;
      if (remainingTime > 0) {
        console.log(`${key}: ${Math.ceil(remainingTime / 1000)} seconds remaining`);
      } else {
        console.log(`${key}: Expired`);
      }
    }
  });
}

// 🦊Optionally, run the countdown periodically🦊
setInterval(cacheExpirationCountdown, 1000);

/**  🦊Note🦊: This is an optional feature for monitoring cache expiration in the console.
     Use it primarily for development and debugging purposes. It should be used
     cautiously in a production environment as it can impact performance. */

// Example of subscribing to state changes
subscribeStateChange("someStateKey", (newState) => {
  console.log("State changed:", newState);
});
```

### Through this update, QuickRenard aims to enhance application performance and enable more efficient state management. The Ver 2.3.0 update has been focused particularly on large-scale applications and data-intensive tasks.

<br />
<br />

## 🦊Ver 2.6.0 - Ver 2.7.0🦊

- The state management system has become more powerful. You can now effectively manage complex dependencies between states using graph traversal algorithms. Utilize Depth-First Search (DFS) and Breadth-First Search (BFS) algorithms to effectively handle the impacts of state updates on other states.

1. Depth-First Search (DFS): Explores dependencies deeply connected between states. This method is suitable when there are deep connections between states.
2. Breadth-First Search (BFS): Explores dependencies across a wider range of states. This method is useful for managing influences across a broader spectrum of states.
3. Enhanced State Management(❗Ver 2.7.0❗): The state management system is now even more intelligent. It automatically determines the most effective graph traversal strategy (DFS or BFS) to manage complex dependencies between states. This enhancement simplifies the process of managing state updates and their impacts on other states.

### - Key Features:
1. Automated Strategy Selection: The system now automatically selects between Depth-First Search (DFS) and Breadth-First Search (BFS) based on the nature of state dependencies.

- DFS is chosen for deeply connected state dependencies (e.g., A -> B -> C).
- BFS is used when a state has multiple parallel dependencies (e.g., A -> [B, C, D]).

2. Simplified State Updates: Users no longer need to manually choose between DFS and BFS. The system intelligently decides the optimal approach, making state management more efficient and effective.

<br />
<br />

## 🦊 Using setStateDependencies and updateState Functions 🦊

1. setStateDependencies(dependencies): Define the dependencies between different states. The system will use these dependencies to determine the traversal strategy.

```javascript
const dependencies = {
    'childData.data': ['parentData', 'siblingData'],
};
setStateDependencies(dependencies);
```

2. updateState(stateKey, newValue): Update a state, and the system will automatically use DFS or BFS as needed.

```javascript
const newData = "Some Data";
updateState('childData.data', newData);
console.log("State updated with the appropriate strategy");
```

- This approach provides a more streamlined and powerful tool for managing complex state dependencies, allowing for more tailored and efficient state updates.

<br />
<br />

## 🦊 Example Usage: 🦊

1. child.js

```javascript
import React from 'react';
import { useStateMutation, updateState } from 'quickrenard';

function Child() {
    const [setData, data] = useStateMutation('childData.data');

    const handleUpdateData = () => {
        const newData = "Updated Data from Child";
        updateState('childData.data', newData);
        console.log("State updated with the appropriate strategy");

        // Update the state using the useStateMutation hook
        setData(newData);
    };

    return (
        <div>
            <h3>Child Component</h3>
            <p>Data: {data}</p>
            <button onClick={handleUpdateData}>Update Data</button>
        </div>
    );
}

export default Child;
```

2. stateSchema.js

```javascript
export const stateSchema = {
    'childData.data': {
        type: 'string',
        defaultValue: 'Initial Child Data',
        // Define dependencies that will trigger BFS
        dependencies: ['parentData', 'siblingData'] // These are parallel dependencies
    },
    'parentData': {
        type: 'string',
        defaultValue: 'Initial Parent Data'
    },
    'siblingData': {
        type: 'string',
        defaultValue: 'Initial Sibling Data'
    }
};
```

3. stateStore.js

```javascript
import { initializeStore, setStateDependencies } from 'quickrenard';
import { stateSchema } from './stateSchema';

// Define state dependencies
const dependencies = {
    'childData.data': ['parentData', 'siblingData'],
};

// Initialize Store
initializeStore(stateSchema);

// Set state dependencies
setStateDependencies(dependencies);
```

## 🦊 Summary 🦊

- Ver 2.7.0 simplifies state management in applications with complex dependencies, automatically choosing the most efficient graph traversal strategy (DFS or BFS) based on the defined state dependencies. This enhancement streamlines state updates, reducing the need for manual intervention and improving efficiency.

<br />
<br />

## 🦊Ver 2.7.1 - 🦊

- Independent from Lodash.

<br />
<br />

## 🦊Ver 2.8.1 ~ 🦊

Enhancement and Expansion of State Management Hooks

### Key Changes:

1. Improvement in useStateQuery: In Ver 2.8.0, useStateQuery has been enhanced to manage the loading and error states of data more effectively. In addition to the data field, the returned object now includes loading and error fields. These additions enable easy tracking of the data loading process and any potential errors that might occur. The inclusion of these fields allows for more detailed and nuanced handling of various scenarios that may arise during the state querying process, facilitating stronger and more flexible state management.

2. Expansion of useStateMutation: The logic for state change in useStateMutation has been enhanced to handle asynchronous operations. Added features manage the loading state and error handling during state changes, proving highly useful for asynchronous operations like API calls. Users can easily manage the state change function (mutate), current state (state), loading state (loading), and any errors (error) that occur.

3. Improved State Change Detection in useStateSubscription: The useStateSubscription has been improved for more refined detection of state changes. The callback function now maintains the latest state, accurately detecting and responding to state changes.

4. Enhanced TypeScript Support: The hooks.d.ts file has been updated to supplement the TypeScript definitions for all hooks. useStateQuery and useStateMutation use the StateQueryResult<T> and StateMutationResult<T> interfaces, respectively, to clearly define their return types. These definitions assist developers in using the hooks more accurately and safely.

5. Enhanced Asynchronous Processing in updateState: The updateState function now allows for asynchronous state updates. This function updates a state and all its dependent states using an appropriate traversal strategy (DFS or BFS). These changes offer the following advantages:

5-1. Asynchronous State Management: The updateState function returns a Promise, allowing asynchronous waiting for the completion of state updates. This is especially useful in integrating external asynchronous operations like API calls.

5-2. Dependent State Updates: Considering the dependencies between states, an update to one state automatically reflects in all its dependent states. This facilitates easier management of complex state relationships.

5-3. DFS and BFS Strategies: The strategy for state updates, whether DFS (Depth-First Search) or BFS (Breadth-First Search), is determined based on the relationships between states. This allows for the selection of the most efficient update strategy according to the state structure.

- This update strengthens and makes state management more flexible by integrating asynchronous operations, managing complex state relationships, and optimizing state update strategies. These improvements will be particularly effective in interactions with external data sources and handling complex state dependencies.
<br />
<br />

## 🦊 Example Usage (Ver 2.8.1 ~ ): 🦊

1. child.js

```javascript
import React from 'react';
import { useStateMutation, updateState, registerFunction } from 'quickrenard';

function Child() {
  // Using useStateMutation to manage 'childData.data' state.
  // This hook returns the current state value.
  const { state: data } = useStateMutation('childData.data');

  const handleUpdateData = () => {
    const newData = "Updated Data from Child";

    // Calling the asynchronous updateState function to update 'childData.data'.
    // It returns a Promise, allowing us to handle the completion or failure of the update.
    updateState('childData.data', newData)
      .then(() => {
        // Logging on successful state update.
        console.log("State and dependent states updated with the appropriate strategy");
      })
      .catch(err => {
        // Logging in case of an error.
        console.error("Error updating state:", err);
      });
  };

  // Registering a function 'childFunction' that can be called by the Cousin component.
  // This function logs a message received from the Cousin component.
  registerFunction('childFunction', (message) => {
    console.log("Message from Cousin:", message);
    return "Response from Child";
  });

  return (
    <div>
      <h3>Child Component</h3>
      <p>Data: {data}</p>
      <button onClick={handleUpdateData}>Update Data</button>
    </div>
  );
}

export default Child;
```

2. cousin.js

```javascript
import React, { useEffect, useState } from 'react';
import { useStateQuery, useStateSubscription } from 'quickrenard';

function Cousin() {
  // Use useStateQuery to manage the state of 'childData.data'.
  // This hook returns an object with { data, loading, error } for 'childData.data'.
  const { data: childData, loading: childLoading, error: childError } = useStateQuery('childData.data');

  // Use useStateQuery to manage the state of 'parentData'.
  // The hook fetches the current state of 'parentData'.
  const { data: parentData } = useStateQuery('parentData');

  // Use useStateQuery to manage the state of 'siblingData'.
  // The hook fetches the current state of 'siblingData'.
  const { data: siblingData } = useStateQuery('siblingData');

  // Local states to display data, initialized with the data from useStateQuery.
  const [displayedChildData, setDisplayedChildData] = useState(childData);
  const [displayedParentData, setDisplayedParentData] = useState(parentData);
  const [displayedSiblingData, setDisplayedSiblingData] = useState(siblingData);

  // Subscribe to changes in 'childData.data' and update displayedChildData accordingly.
  // This will re-render the component with new child data when it changes.
  useStateSubscription('childData.data', (newData) => {
    console.log("Child data has changed!");
    setDisplayedChildData(newData);
  });

  // Subscribe to changes in 'parentData' and update displayedParentData accordingly.
  // This will re-render the component with new parent data when it changes.
  useStateSubscription('parentData', (newData) => {
    console.log("Parent data has changed!");
    setDisplayedParentData(newData);
  });

  // Subscribe to changes in 'siblingData' and update displayedSiblingData accordingly.
  // This will re-render the component with new sibling data when it changes.
  useStateSubscription('siblingData', (newData) => {
    console.log("Sibling data has changed!");
    setDisplayedSiblingData(newData);
  });

  // useEffect to log when Cousin component mounts.
  // Useful for checking if the component is correctly mounted.
  useEffect(() => {
    console.log('Cousin mounted.');
  }, []);

  // Render the loading state, error state, or the actual data from childData, parentData, and siblingData.
  return (
    <div>
      <h3>Cousin Component</h3>
      <p>Child Data: {childLoading ? 'Loading...' : childError ? childError.message : displayedChildData}</p>
      <p>Parent Data: {displayedParentData}</p>
      <p>Sibling Data: {displayedSiblingData}</p>
    </div>
  );
}

export default Cousin;
```

3. stateSchema.js

```javascript
export const stateSchema = {
    'childData.data': {
        type: 'string',
        defaultValue: 'Initial Child Data',
        dependencies: ['parentData', 'siblingData']
    },
    'parentData': {
        type: 'string',
        defaultValue: 'Initial Parent Data'
    },
    'siblingData': {
        type: 'string',
        defaultValue: 'Initial Sibling Data'
    }
};
```

4. stateStore.js

```javascript
// stateStore.js
import { initializeStore, getCacheObject, setStateDependencies } from 'quickrenard';
import { stateSchema } from './stateSchema';

// Define state dependencies
const dependencies = {
    'childData.data': ['parentData', 'siblingData'],
};

// Initialize Store
// Example: Set cache expiration time to 30 minutes
initializeStore(stateSchema, { cacheExpirationTime: 1800000 });

// // Set state dependencies
setStateDependencies(dependencies);

/** 🦊Optional Usage Example🦊: Function for cache expiration countdown */

// Function for cache expiration countdown
function cacheExpirationCountdown() {
  // Get the current time
  const now = performance.now();

  // Access the cache object
  const cache = getCacheObject();

  console.clear();
  console.log("Cache Expiration Countdown:");

  // Iterate through each cache key and display the remaining time
  Object.keys(cache).forEach(key => {
    const record = cache[key];
    if (record) {
      const remainingTime = record.expirationTime - now;
      if (remainingTime > 0) {
        console.log(`${key}: ${Math.ceil(remainingTime / 1000)} seconds remaining`);
      } else {
        console.log(`${key}: Expired`);
      }
    }
  });
}

// 🦊Optionally, run the countdown periodically🦊
setInterval(cacheExpirationCountdown, 1000);
```

<br />
<hr />
<br />

### Adjust your component implementations as necessary to align with these examples and the unique details of your project. This documentation is designed to provide a conceptual understanding of QuickRenard's enhanced functionality.

<br />
<hr />
<br />

## 🦊License🦊

- This project is licensed under the MIT License - see the LICENSE.md file for details.