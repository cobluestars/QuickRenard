![QuickRenard Logo](https://github.com/cobluestars/QuickRenard/blob/main/public/QuickRenard.png?raw=true)

# 🦊quickrenard🦊

GraphQL의 원리를 차용하여
React의 상태(State)를 관리하는 라이브러리

## 🦊Quick Renard🦊를 제작했습니다.

Quick Renard는 전역 상태 저장소를 통해 상태를 중앙에서 관리하면서,
스키마를 통한 유효성 검사와 구독 기반의 상태 변화 알림 메커니즘을 제공하여, 
React 애플리케이션의 상태 관리를 간편하고 효과적으로 수행할 수 있게 도와주는 도구입니다.

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


사용자는 쿼리와 변이를 사용하여 상태에 쉽게 접근하고 수정할 수 있으며, 
필요한 상태의 변화만을 구독하여 컴포넌트를 리렌더링할 수 있게 됩니다.


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


# ❗❗❗ How to use ❗❗❗

# quickrenard: A Simple State Management in React

QuickRenard(quickrenard) is a lightweight state management solution for React applications. By providing clear paths for data querying, mutation, and subscriptions, QuickRenard streamlines the state-sharing process between components, even if they aren't directly related in the component tree.

## Setup and Initialization

To start using quickrenard, you first need to define a schema for your state and then initialize the store.

### 1. Define State Schema:

Your state is structured based on a schema. This schema outlines the shape, type, and default values of your state properties.

```javascript
// stateSchema.js
export const childStateSchema = {
  type: "object",
  properties: {
    data: {
      type: "string",
      default: "Initial Data from Child"
    }
  }
};
```

### 2. Initialize Store:
Once you have your schema in place, initialize the state store with it. This sets up the initial state for your application.

```javascript
// stateStore.js
import { initializeStore } from 'quickrenard';
import { childStateSchema } from './stateSchema';

initializeStore({
  childData: childStateSchema.properties
});
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