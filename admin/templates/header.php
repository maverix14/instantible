<?php

if (!defined('ABSPATH')) exit;

?>
<header class="daftplugAdminHeader">
	<a class="daftplugAdminHeader_logo" href="<?php echo admin_url('admin.php?page=' . $this->slug); ?>">
        <img class="daftplugAdminHeader_img" src="<?php echo plugins_url('admin/assets/img/icon-logo.png', $this->pluginFile); ?>" width="48" height="48" alt="<?php esc_html_e($this->name . ' Plugin', $this->textDomain); ?>">
    </a>
    <span class="daftplugAdminHeader_title"><?php esc_html_e($this->name . ' Plugin', $this->textDomain); ?></span>
    <span class="daftplugAdminHeader_versionText"><?php printf(__('Version %s', $this->textDomain), $this->version); ?></span>
    <a class="daftplugAdminButton -getAppHeader" href="#/overview/" data-page="overview" data-targetid="daftplugAdminGetAppNotice"><?php esc_html_e('Get native PWA apps', $this->textDomain); ?></a>
    <div class="daftplugAdminHeader_search">
        <span class="daftplugAdminButton -search" data-tooltip="<?php esc_html_e('Search Settings', $this->textDomain); ?>" data-tooltip-flow="left">
            <svg class="daftplugAdminHeader_icon">
                <use href="#iconSearch"></use>
            </svg>
        </span>
        <input type="text" placeholder="<?php esc_html_e('Search Settings...', $this->textDomain); ?>" value="" class="daftplugAdminHeader_field"/>
        <span class="daftplugAdminHeader_results">
            <h4 class="daftplugAdminHeader_notfound"><?php esc_html_e('No Results', $this->textDomain); ?></h4>
        </span>
    </div>
</header>