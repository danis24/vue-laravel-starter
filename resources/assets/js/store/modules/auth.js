import axios from "axios";
import Cookies from "js-cookie";
import * as types from "../mutation-types";

// state
export const state = {
  user: null,
  token: Cookies.get("token")
};

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  check: state => state.user !== null
};

// mutations
export const mutations = {
  [types.SAVE_TOKEN](state, { token, remember }) {
    state.token = token;
    Cookies.set("token", token, { expires: remember ? 365 : null });
  },

  [types.FETCH_USER_SUCCESS](state, { user }) {
    state.user = user;
  },

  [types.FETCH_USER_FAILURE](state) {
    state.token = null;
    Cookies.remove("token");
  },

  [types.LOGOUT](state) {
    state.user = null;
    state.token = null;

    Cookies.remove("token");
  },

  [types.UPDATE_USER](state, { user }) {
    state.user = user;
  }
};

// actions
export const actions = {
  async login({ commit, dispatch }, payload) {
    try {
      const { data } = await axios.post("/api/v1/auth/login", payload);
      dispatch("saveToken", { token: data.access_token, remember: null });
      dispatch("fetchUser");
      dispatch("noti", { message: "You are Log In!", type: "success" }, { root: true });
    }catch(e) {
      dispatch("noti", { message: "Error to Log In!", type: "error" }, { root: true });
    }
  },

  async register({ commit, dispatch }, payload) {
    try {
      const { data } = await axios.post("/api/v1/auth/register", payload);
      dispatch("saveToken", { token: data.access_token, remember: null });
      dispatch("fetchUser");
      dispatch("noti", { message: "You are Log In!", type: "success" }, { root: true });
    }
    catch(e) {
      dispatch("noti", { message: "Error to Log In!", type: "error" }, { root: true });
    }
  },

  async forgot({ commit, dispatch }, payload) {
    try {
      const { data } = await axios.post("/api/v1/auth/password/email", payload);
      dispatch("noti", { message: "Email send Succesfull!", type: "success" }, { root: true });
    } catch (e) {
      dispatch("noti", { message: "Email not send !", type: "error" }, { root: true });
    }
  },

  saveToken({ commit, dispatch }, payload) {
    commit(types.SAVE_TOKEN, payload);
  },

  async fetchUser({ commit }) {
    try {
      const { data } = await axios.post("/api/v1/auth/me");
      commit(types.FETCH_USER_SUCCESS, { user: data });
    } catch (e) {
      commit(types.FETCH_USER_FAILURE);
    }
  },

  updateUser({ commit }, payload) {
    commit(types.UPDATE_USER, payload);
  },

  async logout({ commit }) {
    try {
      await axios.post("/api/v1/auth/logout");
    } catch (e) {}

    commit(types.LOGOUT);
  }
};
