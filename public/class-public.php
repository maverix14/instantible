<?php

if (!defined('ABSPATH')) exit;

if (!class_exists('daftplugInstantifyPublic')) {
    class daftplugInstantifyPublic {
        public $name;
        public $description;
        public $slug;
        public $version;
        public $textDomain;
        public $optionName;

        public $pluginFile;
        public $pluginBasename;

        protected $dependencies;

        public $purchaseCode;

        public $capability;

        public $settings;

        public $daftplugInstantifyPwa;
        public $daftplugInstantifyAmp;
        public $daftplugInstantifyFbia;

        public $partials;

        public $html;
        public $css;
        public $js;

        public function __construct($config, $daftplugInstantifyPwa, $daftplugInstantifyAmp, $daftplugInstantifyFbia) {
            $this->name = $config['name'];
            $this->description = $config['description'];
            $this->slug = $config['slug'];
            $this->version = $config['version'];
            $this->textDomain = $config['text_domain'];
            $this->optionName = $config['option_name'];

            $this->pluginFile = $config['plugin_file'];
            $this->pluginBasename = $config['plugin_basename'];

            $this->dependencies = array();

            $this->purchaseCode = get_option("{$this->optionName}_purchase_code");

            $this->capability = 'manage_options';

            $this->settings = $config['settings'];

            $this->daftplugInstantifyPwa = $daftplugInstantifyPwa;
            $this->daftplugInstantifyAmp = $daftplugInstantifyAmp;
            $this->daftplugInstantifyFbia = $daftplugInstantifyFbia;

            $this->partials = $this->generatePartials();

            $this->html = '';
            $this->css = '';
            $this->js = '';

            add_action('wp_enqueue_scripts', array($this, 'loadAssets'));
            add_action('wp_footer', array($this, 'addPublicCssHtmlJs'), 70);

            if (daftplugInstantify::getSetting('pwa') == 'off' && daftplugInstantify::isPwaPage()) {
                add_filter("{$this->optionName}_public_html", array($this, 'renderPwaForbid'));
            }
        }

        public function loadAssets() {            
            $this->dependencies[] = 'jquery';
               
            wp_enqueue_style("{$this->slug}-public", plugins_url('public/assets/css/style-public.min.css', $this->pluginFile), array(), $this->version);
            wp_enqueue_script("{$this->slug}-public", plugins_url('public/assets/js/script-public.min.js', $this->pluginFile), $this->dependencies, $this->version, true);

            // Pass PHP variables in JS
            wp_localize_script("{$this->slug}-public", "{$this->optionName}_public_js_vars", apply_filters("{$this->optionName}_public_js_vars", array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'generalError' => esc_html__('An unexpected error occurred', $this->textDomain),
                'homeUrl' => trailingslashit(strtok(home_url('/', 'https'), '?')),
                'adminUrl' => trailingslashit(strtok(admin_url('/', 'https'), '?')),
                'currentUrl' => daftplugInstantify::getCurrentUrl(false),
                'iconUrl' => @wp_get_attachment_image_src(daftplugInstantify::getSetting('pwaIcon'), 'full')[0],
                'settings' => $this->settings,
            )));
        }

        public function generatePartials() {
            $partials = array(
                'pwaForbid' => plugin_dir_path(__FILE__) . implode(DIRECTORY_SEPARATOR, array('partials', 'display-pwaforbid.php')),
            );

            return $partials;
        }

        public function addPublicCssHtmlJs() {
            ?>
            <div class="daftplugPublic" data-daftplug-plugin="<?php echo $this->optionName ?>">
                <style type="text/css">
                    <?php echo apply_filters("{$this->optionName}_public_css", $this->css); ?>
                </style>
                <?php echo apply_filters("{$this->optionName}_public_html", $this->html); ?>
                <script type="text/javascript">
                    jQuery(function() {
                        'use strict';
                        <?php echo apply_filters("{$this->optionName}_public_js", $this->js); ?>
                    });
                </script>
            </div>
            <?php
        }

        public function renderPwaForbid() {
            if (daftplugInstantify::isAmpPage()) {
                return;
            }

            include_once($this->partials['pwaForbid']);
        }
    }
}