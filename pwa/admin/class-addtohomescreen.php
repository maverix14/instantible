<?php

if (!defined('ABSPATH')) exit;

if (!class_exists('daftplugInstantifyPwaAdminAddtohomescreen')) {
    class daftplugInstantifyPwaAdminAddtohomescreen {
    	public $name;
        public $description;
        public $slug;
        public $version;
        public $textDomain;
        public $optionName;

        public $pluginFile;
        public $pluginBasename;
        public $pluginUploadDir;

        public $settings;

    	public function __construct($config) {
    		$this->name = $config['name'];
            $this->description = $config['description'];
            $this->slug = $config['slug'];
            $this->version = $config['version'];
            $this->textDomain = $config['text_domain'];
            $this->optionName = $config['option_name'];

            $this->pluginFile = $config['plugin_file'];
            $this->pluginBasename = $config['plugin_basename'];
            $this->pluginUploadDir = $config['plugin_upload_dir'];

            $this->settings = $config['settings'];

            add_action("wp_ajax_{$this->optionName}_generate_launch_screens_and_maskable_icons", array($this, 'generateLaunchScreensAndMakableIcons'));
    	}

		public function generateLaunchScreensAndMakableIcons() {
			if (isset($this->settings['pwaIcon'])) {
				if ((isset($_POST['launchScreen']) && !empty($_POST['launchScreen'])) && (isset($_POST['maskableIcon']) && !empty($_POST['maskableIcon']))) {
					$launchScreen = substr($_POST['launchScreen'], strpos($_POST['launchScreen'], ',') + 1);
	            	$maskableIcon = substr($_POST['maskableIcon'], strpos($_POST['maskableIcon'], ',') + 1);
					$decodedLaunchScreen = base64_decode($launchScreen);
	            	$decodedMaskableIcon = base64_decode($maskableIcon);
					$launchScreenName = $this->pluginUploadDir . 'img-pwa-apple-launch.png';
	            	$maskableIconName = $this->pluginUploadDir . 'icon-pwa-maskable.png';
	            	
					daftplugInstantifyPwa::putContent($launchScreenName, $decodedLaunchScreen);
					daftplugInstantifyPwa::putContent($maskableIconName, $decodedMaskableIcon);

					if (file_exists($launchScreenName)) {
		            	$launchScreenImage = wp_get_image_editor($launchScreenName);
                    	if (!is_wp_error($launchScreenImage)) {
        	            	$sizesArray = array(
								array ('width' => 640, 'height' => 1136, 'crop' => true),
								array ('width' => 750, 'height' => 1334, 'crop' => true),
								array ('width' => 828, 'height' => 1792, 'crop' => true),
								array ('width' => 1125, 'height' => 2436, 'crop' => true),
								array ('width' => 1170, 'height' => 2532, 'crop' => true),
								array ('width' => 1179, 'height' => 2256, 'crop' => true),
								array ('width' => 1242, 'height' => 2208, 'crop' => true),
								array ('width' => 1242, 'height' => 2688, 'crop' => true),
								array ('width' => 1284, 'height' => 2778, 'crop' => true),
								array ('width' => 1290, 'height' => 2796, 'crop' => true),
								array ('width' => 1536, 'height' => 2048, 'crop' => true),
								array ('width' => 1620, 'height' => 2160, 'crop' => true),
								array ('width' => 1640, 'height' => 2360, 'crop' => true),
								array ('width' => 1668, 'height' => 2224, 'crop' => true),
								array ('width' => 1668, 'height' => 2388, 'crop' => true),
								array ('width' => 2048, 'height' => 2732, 'crop' => true),
        	            	);
         
        	            	$launchScreenImage->multi_resize($sizesArray);
                        	$launchScreenImage->save();
                    	}
                	}

                	if (file_exists($maskableIconName)) {
		            	$maskableIconImage = wp_get_image_editor($maskableIconName);
                    	if (!is_wp_error($maskableIconImage)) {
        	            	$sizesArray = array(
								array ('width' => 192, 'height' => 192, 'crop' => true),
								array ('width' => 180, 'height' => 180, 'crop' => true),
        	            	);
         
        	            	$maskableIconImage->multi_resize($sizesArray);
                        	$maskableIconImage->save();
                    	}
                	}

					wp_send_json_success(array(
						'message' => esc_html__('Launch Screens and Makable Icons are generated successfully!', $this->textDomain),
					));
				}
			} else {
				wp_send_json_error(array(
					'message' => esc_html__('Launch Screens and Makable Icons generation failed!', $this->textDomain),
				));
			}
		}
    }
}