<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-lg-flex">
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto navbar-brand-center navbar-fixed">
      <b-nav-item-dropdown right toggle-class="d-flex align-items-center dropdown-user-link" class="dropdown-user">
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">Welcome, {{ userData.name }}</p>
          </div>
        </template>

        <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import { BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar } from 'bootstrap-vue';
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue';
import useJwt from '@/auth/jwt/useJwt';
import { initialAbility } from '@/libs/acl/config';
import ability from '@/libs/acl/ability';
export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return { userData: JSON.parse(localStorage.getItem('userData')) };
  },
  methods: {
    logout() {
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

      // Remove userData from localStorage
      localStorage.removeItem('userData');

      // Reset ability
      ability.update(initialAbility);

      // Redirect to login page
      this.$router.push({ name: 'auth-login' });
    },
  },
};
</script>
<style>
.vertical-layout.vertical-menu-modern.menu-collapsed .navbar .navbar-header {
  float: unset;
  text-align: center;
  flex-grow: 1;
}
</style>
