![QuickRenard Logo](https://github.com/cobluestars/QuickRenard/blob/main/public/QuickRenard.png?raw=true)

# 🦊quickrenard🦊

<p> GraphQL의 원리를 일부 차용하여 </p>
<p> React의 상태(State)와 함수를 관리하는 라이브러리 </p>
<br />

## 🦊Quick Renard를 제작했습니다.🦊

<p> Quick Renard는 전역 상태 저장소를 통해 상태를 중앙에서 관리하면서, </p>
<p> 스키마를 통한 유효성 검사와 구독 기반의 상태 변화 알림 메커니즘을 제공하여, </p> 
<p> React 애플리케이션의 상태 관리를 간편하고 효과적으로 수행할 수 있게 도와주는 도구입니다. </p>
<br />

## 🦊Ver 1.2.0🦊

<label> 타입 검증 로직 추가 </label>

<br />

1. Enum 검증:

- enum 키를 통해 허용된 문자열 집합을 정의할 수 있습니다.
- 해당 값이 enum에 정의된 문자열 중 하나인지 검사합니다.
- 예를 들어, 상태가 특정 문자열 값들 중 하나만 가져야 할 경우 사용됩니다.

2. 객체 속성 검증:

- properties 키를 통해 객체의 각 속성에 대한 스키마를 정의할 수 있습니다.
- 각 속성의 유형을 검사하여 해당 속성이 올바른 유형인지 확인합니다.
- 객체 내부의 각 속성이 정의된 스키마를 따르는지 검사하기 위해 사용됩니다.

3. 배열 항목 타입 검증:

- 배열의 모든 항목이 해당 스키마를 준수하는지 검사합니다.
- 배열 내부의 각 항목이 정의된 스키마를 따르는지 검사하기 위해 사용됩니다.

<br />
<hr />
<br />

## 🦊Ver 2.0.0🦊

<label> 함수 전역 관리 기능 functionStore 추가 </label>

### 1. 관리할 수 있는 대표적인 함수 유형 목록:

 - 순수 함수: 동일한 인자에 대해 항상 동일한 결과를 반환하고, 외부 상태를 변경하지 않는 함수입니다.
 
 - 유틸리티 함수: 문자열 처리, 날짜 계산, 숫자 포맷팅 등 재사용 가능한 기능을 제공합니다.
 
 - 헬퍼 함수: 반복적으로 사용되는 로직을 추상화한 함수입니다 (예: API 요청).
 
### 2. 이 함수 저장소는 위의 유형의 함수를 효과적으로 관리할 수 있으나, 다음의 주의가 필요합니다:
 
 - 사이드 이펙트: 함수가 외부 시스템의 상태에 영향을 주거나 그로부터 영향을 받는 경우,
  (예시: 데이터베이스에 접근하거나 외부 API를 호출하는 함수) 예측하지 못한 결과를 초래할 수 있습니다.
 
 - 상태 의존성: 함수가 내부 상태에 의존하는 경우, 그 상태의 변화가 함수의 결과에 영향을 줄 수 있습니다.
 
 - 스코프와 클로저: 함수가 특정 스코프의 변수를 사용하는 경우, 이러한 의존성을 관리해야 합니다.

 - 동시성 제어: 여러 구독자가 동일한 함수의 결과를 구독할 때 발생하는 동시성 이슈를 관리해야 합니다.

### functionStore를 사용하려면, 아래에 있는 !!! How to use !!! 를 참조하세요.

<br />
<hr />
<br />

### 1. 정의 및 설계
쿼리 기반의 상태 정의: 각 상태를 GraphQL 스키마처럼 정의합니다.
예를 들어, 상태의 타입, 초기 값, 의존성 등을 명시적으로 표현합니다.

쿼리 및 변이 작성: 사용자가 상태를 조회하거나 수정할 수 있도록 쿼리와 변이를 제공합니다.

### 2. 라이브러리 구현
1. 상태 저장소: 모든 상태를 저장하는 중앙 저장소를 만듭니다.
2. 쿼리 해석기: 주어진 쿼리를 해석하고 해당하는 상태를 반환하는 로직을 구현합니다.
3. 변이(Mutation) 처리기: 주어진 변이(Mutation)를 해석하고 상태를 업데이트하는 로직을 구현합니다.
4. 구독(subscription) 메커니즘: 특정 상태의 변이를 구독(subscription)하고, 변이가 감지되면 콜백을 실행하는 메커니즘을 구현합니다.

### 3. React Hooks
1. useStateQuery: 주어진 쿼리에 해당하는 상태를 반환하는 Hook을 제공합니다.
2. useStateMutation: 주어진 변이를 실행하는 함수와 상태를 반환하는 Hook을 제공합니다.
3. useStateSubscription: 주어진 상태의 변화를 구독하고, 변화가 감지되면 컴포넌트를 리렌더링하는 Hook을 제공합니다.


<p>사용자는 쿼리와 변이를 사용하여 상태에 쉽게 접근하고 수정할 수 있으며,</p>
<p>필요한 상태의 변화만을 구독하여 컴포넌트를 리렌더링할 수 있게 됩니다.</p>

<br />

### 1. 상태 저장소 (stateStore):

Quick Renard 라이브러리에서는 전역적으로 관리되는 stateStore라는 중앙 저장소를 통해 상태를 관리합니다. 

이 저장소에는 애플리케이션의 모든 상태가 저장되며, 
쿼리 기반의 접근 방식을 사용하여 특정 상태를 검색하거나 수정할 수 있습니다.

### 2. 상태 스키마 (StateSchema):

상태의 구조와 기대되는 타입, 기본값 등을 정의하기 위해 스키마를 사용합니다.
이를 통해 상태의 초기 설정을 쉽게 할 수 있으며, 상태 변경 시 유효성 검사의 기준으로 사용됩니다.

### 3. 상태 변이 (setStateMutation):

이 함수를 통해 상태를 수정하게 됩니다.
함수 내부에서는 스키마를 바탕으로 상태의 유효성 검사를 수행할 수 있으며,
해당 상태에 변화가 있을 경우, 그 상태를 구독하고 있는 모든 구독자들에게 알림을 보냅니다.

### 4. 상태 구독 (subscribeStateChange):

특정 상태의 변화를 관찰하고자 하는 컴포넌트는 이 함수를 통해 해당 상태의 변화를 구독합니다. 
상태가 변경될 때마다 구독하고 있는 컴포넌트는 콜백 함수를 실행하게 됩니다. 
이를 통해 상태 변화에 따른 리렌더링이나 다른 작업을 수행할 수 있습니다.


### 요약:
1. 상태를 쿼리화하여 statestore에 저장해서 전역으로 관리하고,
2. 스키마를 사용해 상태의 구조와 타입을 정의하고,
3. setStateMutation같은 함수에서 유효성 검사를 수행하고 초기 상태를 설정하며, 
4. setStateSubscription을 이용해 상태를 사용하길 원하는 컴포넌트에서 구독해서 사용

<br />
<br />

# ❗❗❗ How to use ❗❗❗

# 🦊 quickrenard 🦊: A Simple State Management in React

QuickRenard(quickrenard) is a lightweight state management solution for React applications. By providing clear paths for data querying, mutation, and subscriptions, QuickRenard streamlines the state-sharing process between components, even if they aren't directly related in the component tree.

<br />
<hr />
<br />

## 🦊Version 2.0.0🦊

<label> Global function management feature 'functionStore' added </label>

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
<hr />
<br />

## 🦊Ver 1.2.0🦊

Added type validation logic.

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
<hr />
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
<hr />
<br />

# 🦊 QuickRenard 🦊 (Ver 2.0.0):  State & Function Management in React

QuickRenard provides a streamlined way to manage both state and functions globally in your React application. With the introduction of functionStore in version 2.0.0, QuickRenard not only allows you to manage state efficiently but also to register and invoke functions across your component tree, promoting reusability and separation of concerns.

## 🦊 Version 2.0.0 🦊: Introducing FunctionStore
<br />
Alongside state management, QuickRenard now brings a powerful functionStore utility, enabling you to:

- Register and manage globally accessible functions.
- Invoke registered functions from any component.
- Maintain cleaner code by abstracting common logic into functions.
- Avoid prop drilling for functions, just like state.

## Setup and Initialization

- To leverage the full capabilities of QuickRenard, follow these steps to set up your function stores:

<br />

### Initialize Function Store (New in v2.0.0):

```javascript
// functionStore.js
import { registerFunction, callFunction } from './functionStore';

// Register a global function
registerFunction('globalLogger', (message) => console.log(message));

// Later in your app, call the registered function
callFunction('globalLogger', 'This is a global log message');
```

## Using QuickRenard in Components

- QuickRenard provides hooks for querying, mutating state, and subscribing to state changes. Now with the function store, you can also register and call functions in your components.

1. Registering Functions (🦊New in v2.0.0):

```javascript
registerFunction('uniqueFunctionName', yourFunctionLogic);
```

2. Invoking Registered Functions (🦊New in v2.0.0):

```javascript
callFunction('uniqueFunctionName', ...args);
```

## 🦊Example🦊: Sharing State and Functions Between Distant Components

-With QuickRenard, components like Child and Cousin can share state and invoke functions without being directly related in the component tree.

### 0.Initialize Function Store

```javascript
// functionStore.js
const functionStore = {};

export const registerFunction = (name, fn) => {
  functionStore[name] = fn;
};

export const callFunction = (name, ...args) => {
  const fn = functionStore[name];
  if (fn) {
    return fn(...args);
  }
  throw new Error(`Function "${name}" is not registered.`);
};
```

### 1. Child Component:
This component mutates the data and registers a function.

```javascript
// Child.js
import React from 'react';
import { useStateMutation } from 'quickrenard';
import { registerFunction } from './functionStore'; // Import the registerFunction

function Child() {
  const [updateChildData, data] = useStateMutation("childData.data");

  const handleUpdateData = () => {
    updateChildData("Updated Data from Child");
    console.log("Data updated!");
  };  

  // Registering a new function called 'childFunction'
  const childFunction = (message) => {
    console.log("Message from Child Function:", message);
  };
  
  registerFunction('childFunction', childFunction);

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

### 2. Cousin Component:
This component queries the data, subscribes to its changes, and invokes a function registered by the Child component.

```javascript
// Cousin.js
import React from 'react';
import { useStateQuery, useStateSubscription } from 'quickrenard';
import { callFunction } from './functionStore'; // Import the callFunction

function Cousin() {
  const data = useStateQuery("childData.data");

  const handleDataChange = () => {
    console.log("Child data has changed!");
    // Call the function registered in Child
    try {
      callFunction('childFunction', 'Data received by Cousin.');
    } catch (error) {
      console.error(error.message);
    }
  };

  useStateSubscription("childData.data", handleDataChange);

  return (
    <div>
      <h3>Cousin Component</h3>
      <p>Data from Child: {data}</p>
    </div>
  );
}

export default Cousin;
```

With the functionStore feature introduced in version 2.0.0, QuickRenard enhances its offering, making it a comprehensive solution for managing not just state but also functions across your React applications.

Remember to adjust your component examples to fit your exact implementation details. This documentation is meant to be a starting point that captures the essence of the functionStore functionality.