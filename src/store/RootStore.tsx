import React from "react";
import { makeAutoObservable, reaction } from "mobx";
import { AuthStore, MainPageStore } from "./stores";

export class Store {
  auth = new AuthStore(this); // todo auth
  mainPage = new MainPageStore(this);   

  subscriptions: (() => void)[] = [];

  constructor() { 
    makeAutoObservable(this);
    const dispose = reaction(
      () => this.auth.isAuthorized,
      (value, prevValue) => {
        if (value === true && prevValue === false) {
          this.afterAuthorized()
        }
      }
    );
    
    this.subscriptions.push(dispose);
  }
  // Загружаются данные связаные с учеткой
  afterAuthorized() {
    console.log('after authorized')
  }

  // Загружаются общие данные, главные страницы и т.д.
  afterLoaded() {
    console.log('after loaded')
  }

  onDestroy() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
  }
}

export const StoreContext = React.createContext(new Store());