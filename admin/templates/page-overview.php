<?php

if (!defined('ABSPATH')) exit;

?>
<article class="daftplugAdminPage -overview" data-page="overview" data-title="<?php esc_html_e('Overview', $this->textDomain); ?>">
    <div class="daftplugAdminPage_heading -flex12">
        <img class="daftplugAdminPage_illustration" src="<?php echo plugins_url('admin/assets/img/illustration-overview.png', $this->pluginFile)?>"/>
        <h2 class="daftplugAdminPage_title"><?php esc_html_e('Overview', $this->textDomain); ?></h2>
        <h5 class="daftplugAdminPage_subheading"><?php printf(__('Welcome to <strong>%s</strong> plugin. Here you may find status, analytics, warnings or any other information related to the plugin.', $this->textDomain), $this->name); ?></h5>
    </div>
	<?php $this->renderNotice(); ?>
    <div class="daftplugAdminPage_content -flex9 -getAppNotice" id="daftplugAdminGetAppNotice">
        <div class="daftplugAdminContentWrapper daftplugAdminGetAppNotice">
            <div class="daftplugAdminGetAppNoticeOptions -flex8">
                <h3 class="daftplugAdminGetAppNotice_title">
                    <?php esc_html_e('Get Android, iOS, Windows & Meta PWA Apps', $this->textDomain); ?>
                    <span data-tooltip="<?php esc_html_e('We can convert your PWA website into a native Desktop/Mobile/VR app with the combination of TWA (Trusted Web Activity) and WebView technologies. You will get store-ready app files with step-by-step guides to submit them. No future app updates are needed on stores.', $this->textDomain); ?>" data-tooltip-flow="bottom">
                        <svg><use href="#iconQuestion"></use></svg>
                    </span>
                </h3>
                <p class="daftplugAdminGetAppNotice_subtitle"><?php esc_html_e('Generate store-ready apps for the Play Store, App Store, Microsoft Store, and more!', $this->textDomain); ?></p>
                <div class="daftplugAdminGetAppNoticeOptions_list">
                    <label class="daftplugAdminInputCheckbox -imgcustom -appselect -android" data-title="Android" data-img="<?php echo plugins_url('admin/assets/img/icon-android.png', $this->pluginFile)?>" data-edit="Google Play" data-price="$19">
                        <input type="checkbox" name="getAppAndroid" id="getAppAndroid" class="daftplugAdminInputCheckbox_field" checked>
                    </label>
                    <label class="daftplugAdminInputCheckbox -imgcustom -appselect -ios" data-title="iOS" data-img="<?php echo plugins_url('admin/assets/img/icon-ios.png', $this->pluginFile)?>" data-edit="App Store" data-price="$29">
                        <input type="checkbox" name="getAppIos" id="getAppIos" class="daftplugAdminInputCheckbox_field" checked>
                    </label>
                    <label class="daftplugAdminInputCheckbox -imgcustom -appselect -windows" data-title="Windows" data-img="<?php echo plugins_url('admin/assets/img/icon-windows.png', $this->pluginFile)?>" data-edit="Microsoft Store" data-price="$24">
                        <input type="checkbox" name="getAppWindows" id="getAppWindows" class="daftplugAdminInputCheckbox_field">
                    </label>
                    <label class="daftplugAdminInputCheckbox -imgcustom -appselect -meta" data-title="Meta" data-img="<?php echo plugins_url('admin/assets/img/icon-meta.png', $this->pluginFile)?>" data-edit="Oculus Quest" data-price="$26">
                        <input type="checkbox" name="getAppMeta" id="getAppMeta" class="daftplugAdminInputCheckbox_field">
                    </label>
                </div>
                <div class="daftplugAdminGetAppNoticePricing">
                    <div class="daftplugAdminGetAppNoticePricing_container">
                        <span class="daftplugAdminGetAppNoticePricing_subtotal">
                            <p class="daftplugAdminGetAppNoticePricing_title"><?php esc_html_e('SUB TOTAL PRICE', $this->textDomain); ?></p>
                            <output class="daftplugAdminGetAppNoticePricing_output">
                                <span class="daftplugAdminGetAppNoticePricing_old"></span>
                                <span class="daftplugAdminGetAppNoticePricing_new"></span>
                            </output>
                        </span>
                        <p class="daftplugAdminGetAppNoticePricing_meta"><?php esc_html_e('✹ Select more than one app and get 20% off', $this->textDomain); ?></p>
                    </div>
                    <span class="daftplugAdminButton daftplugAdminGetAppNotice_button -store"><?php esc_html_e('GET APPS NOW', $this->textDomain); ?></span>
                </div>
            </div>
            <div class="daftplugAdminGetAppNoticeImage -flex4">
                <img class="daftplugAdminGetAppNoticeImage_appicon" src="<?php echo @wp_get_attachment_image_src(daftplugInstantify::getSetting('pwaIcon'), 'full')[0]; ?>" />
                <h6 class="daftplugAdminGetAppNoticeImage_appname"><?php echo daftplugInstantify::getSetting('pwaName'); ?></h6>
                <p class="daftplugAdminGetAppNoticeImage_appdesc"><?php echo daftplugInstantify::getSetting('pwaDescription'); ?></p>
                <img class="daftplugAdminGetAppNoticeImage_appscreenshot" src="<?php echo @wp_get_attachment_image_src(daftplugInstantify::getSetting('pwaScreenshot1'))[0] ?? 'https://s0.wp.com/mshots/v1/'.trailingslashit(daftplugInstantify::getSetting('pwaStartPage')).'?vpw=750&vph=1334'; ?>" />
                <img class="daftplugAdminGetAppNoticeImage_preview" src="<?php echo plugins_url('admin/assets/img/image-store-preview.png', $this->pluginFile); ?>" />
            </div>
            <div class="daftplugAdminGetAppNoticeSummery -flex6">
                <h3 class="daftplugAdminGetAppNotice_title"><?php esc_html_e('Order your PWA apps', $this->textDomain); ?></h3>
                <p class="daftplugAdminGetAppNoticeSummery_subtitle"><?php _e('After the successful payment, we will create packages for your website and send them to you over your delivery email along with the next few steps to submit and make them live in stores. If you are unable to proceed with the payment, please send us an email at <a class="daftplugAdminLink" href="mailto:support@daftplug.com">support@daftplug.com</a> or use this <a class="daftplugAdminLink" href="https://codecanyon.net/user/daftplug#contact" target="_blank">contact form</a>.', $this->textDomain); ?></p>
                <div class="daftplugAdminGetAppNoticeSummery_details">
                    <div class="daftplugAdminGetAppNoticeSummery_controls">
                        <h5><?php esc_html_e('ORDER SUMMERY', $this->textDomain); ?></h5>
                        <span class="daftplugAdminGetAppNoticeSummery_edit">
                            <svg><use href="#iconPencil"></use></svg>
                            <p><?php esc_html_e('EDIT', $this->textDomain); ?></p>
                        </span>
                    </div>
                    <div class="daftplugAdminGetAppNoticeSummery_item -android">
                        <p class="daftplugAdminGetAppNoticeSummery_text"><img src="<?php echo plugins_url('admin/assets/img/icon-android.png', $this->pluginFile)?>"/> Android</p>
                        <p class="daftplugAdminGetAppNoticeSummery_number">$19</p>
                    </div>
                    <div class="daftplugAdminGetAppNoticeSummery_item -ios">
                        <p class="daftplugAdminGetAppNoticeSummery_text"><img src="<?php echo plugins_url('admin/assets/img/icon-ios.png', $this->pluginFile)?>"/> iOS</p>
                        <p class="daftplugAdminGetAppNoticeSummery_number">$29</p>
                    </div>
                    <div class="daftplugAdminGetAppNoticeSummery_item -windows">
                        <p class="daftplugAdminGetAppNoticeSummery_text"><img src="<?php echo plugins_url('admin/assets/img/icon-windows.png', $this->pluginFile)?>"/> Windows</p>
                        <p class="daftplugAdminGetAppNoticeSummery_number">$24</p>
                    </div>
                    <div class="daftplugAdminGetAppNoticeSummery_item -meta">
                        <p class="daftplugAdminGetAppNoticeSummery_text"><img src="<?php echo plugins_url('admin/assets/img/icon-meta.png', $this->pluginFile)?>"/> Meta</p>
                        <p class="daftplugAdminGetAppNoticeSummery_number">$26</p>
                    </div>
                </div>
            </div>
            <div class="daftplugAdminGetAppNoticePayment -flex6">
                <div class="daftplugAdminGetAppNoticePricing_container">
                        <span class="daftplugAdminGetAppNoticePricing_subtotal">
                            <p class="daftplugAdminGetAppNoticePricing_title"><?php esc_html_e('SUB TOTAL PRICE', $this->textDomain); ?></p>
                            <output class="daftplugAdminGetAppNoticePricing_output">
                                <span class="daftplugAdminGetAppNoticePricing_old"></span>
                                <span class="daftplugAdminGetAppNoticePricing_new"></span>
                            </output>
                        </span>
                    </div>
                <div class="daftplugAdminField">
                    <p class="daftplugAdminField_description"><?php esc_html_e('Enter email address where we\'ll send your store packages.', $this->textDomain); ?></p>
                    <div class="daftplugAdminInputText -flexAuto">
                        <input type="text" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" title="<?php esc_html_e('Invalid email address', $this->textDomain); ?>" name="deliveryEmail" id="deliveryEmail" class="daftplugAdminInputText_field" data-placeholder="<?php esc_html_e('Delivery Email', $this->textDomain); ?>" value="" autocomplete="off" required>
                    </div>
                </div>
                <div class="daftplugAdminPaypalButtonContainer" data-tooltip="<?php esc_html_e('Please fill the delivery email field to proceed with the payment.', $this->textDomain); ?>" data-tooltip-flow="top">
                    <div class="daftplugAdminPaypalButton -disabled"></div>
                    <script src="https://www.paypal.com/sdk/js?client-id=AedsKFiD_n0HAGYux72v5vOMTbkqZDzFCV7xQplja4egRmRafd87q2H2xM-eEumHWlFL4OlQCCJuEn5k&enable-funding=venmo&currency=USD" data-sdk-integration-source="button-factory"></script>
                </div>
                <div class="daftplugAdminPaypalButtonResponse"></div>
            </div>
        </div>
    </div>
    <div class="daftplugAdminPage_content -flex6">
        <div class="daftplugAdminContentWrapper">
            <fieldset class="daftplugAdminPluginFeatures -flexAuto">
	            <h4 class="daftplugAdminPluginFeatures_title"><?php esc_html_e('Plugin Features', $this->textDomain); ?></h4>
	            <div class="daftplugAdminField">
	                <label for="pwa" class="daftplugAdminField_label -flex9"><?php esc_html_e('Progressive Web Apps (PWA)', $this->textDomain); ?></label>
	                <label class="daftplugAdminInputCheckbox -flexAuto -featuresCheckbox" data-nonce="<?php echo wp_create_nonce("{$this->optionName}_settings_nonce"); ?>">
	                    <input type="checkbox" name="pwa" id="pwa" class="daftplugAdminInputCheckbox_field" <?php checked(daftplugInstantify::getSetting('pwa'), 'on'); ?>>
	                </label>
	            </div>
	            <div class="daftplugAdminField">
	                <label for="amp" class="daftplugAdminField_label -flex9"><?php esc_html_e('Google Accelerated Mobile Pages (AMP)', $this->textDomain); ?></label>
	                <label class="daftplugAdminInputCheckbox -flexAuto -featuresCheckbox" data-nonce="<?php echo wp_create_nonce("{$this->optionName}_settings_nonce"); ?>">
	                    <input type="checkbox" name="amp" id="amp" class="daftplugAdminInputCheckbox_field" <?php checked(daftplugInstantify::getSetting('amp'), 'on'); ?>>
	                </label>
	            </div>
	            <div class="daftplugAdminField">
	                <label for="fbia" class="daftplugAdminField_label -flex9"><?php esc_html_e('Facebook Instant Articles (FBIA)', $this->textDomain); ?></label>
	                <label class="daftplugAdminInputCheckbox -flexAuto -featuresCheckbox" data-nonce="<?php echo wp_create_nonce("{$this->optionName}_settings_nonce"); ?>">
	                    <input type="checkbox" name="fbia" id="fbia" class="daftplugAdminInputCheckbox_field" <?php checked(daftplugInstantify::getSetting('fbia'), 'on'); ?>>
	                </label>
	            </div>
	        </fieldset>   
        </div>
    </div>
    <div class="daftplugAdminPage_content -flex6">
        <div class="daftplugAdminContentWrapper">
            <div class="daftplugAdminStatus -flexAuto">
                <h4 class="daftplugAdminStatus_title"><?php esc_html_e('Progressive Web Apps', $this->textDomain); ?></h4>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('Validate PWA', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flexAuto"><?php if(daftplugInstantify::getSetting('pwa')=='off'){echo'None';}else{printf('<a class="daftplugAdminLink" href="%s" target="_blank">%s</a>',esc_url(add_query_arg(array('psiurl'=>trailingslashit(strtok(home_url('/', 'https'), '?')),'strategy'=>'mobile','category'=>'pwa'),'https://googlechrome.github.io/lighthouse/viewer/')),esc_html__('View PWA Validation', $this->textDomain));} ?></div>
                </div>
                <?php foreach ($this->getPwaStatus() as $status) { ?>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php echo $status['title'] ?></div>
                    <?php if ($status['condition']) {
                        echo '<div class="daftplugAdminStatus_text -flexAuto"><svg class="daftplugAdminStatus_icon -iconCheck"><use href="#iconCheck"></use></svg> '.$status['true'].'</div>';
                    } else {
                        echo '<div class="daftplugAdminStatus_text -flexAuto"><svg class="daftplugAdminStatus_icon -iconX"><use href="#iconX"></use></svg> '.$status['false'].'</div>';
                    } ?>
                </div>
                <?php } ?>
            </div>
    	</div>
    </div>
    <div class="daftplugAdminPage_content -flex6">
        <div class="daftplugAdminContentWrapper">
            <div class="daftplugAdminAmpInfo -flexAuto <?php if (daftplugInstantify::getSetting('amp') == 'off' || (daftplugInstantify::getSetting('amp') == 'on' && daftplugInstantify::isAmpPluginActive())) { echo '-disabled'; } ?>">
                <h4 class="daftplugAdminFbiaInfo_title"><?php esc_html_e('Google AMP', $this->textDomain); ?></h4>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('AMP URL', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><a class="daftplugAdminLink" href="<?php if(daftplugInstantify::getSetting('amp')=='off'){echo'#';}else{echo trailingslashit(strtok(home_url('/', 'https'), '?')).'?amp';} ?>" target="_blank"><?php if(daftplugInstantify::getSetting('amp')=='off'){echo'None';}else{esc_html_e('View AMP URL', $this->textDomain);} ?></a></div>                
                </div>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('Validated URLs', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><?php if(daftplugInstantify::getSetting('amp')=='off'){echo'None';}else{printf('<a class="daftplugAdminLink" href="%s">%s</a>',esc_url(add_query_arg('post_type',AMP_Validated_URL_Post_Type::POST_TYPE_SLUG,admin_url('edit.php'))),esc_html__('View Validated URLs', $this->textDomain));} ?></div>                
                </div>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('Error Index', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><?php if(daftplugInstantify::getSetting('amp')=='off'){echo'None';}else{printf('<a class="daftplugAdminLink" href="%s">%s</a>',esc_url(get_admin_url(null,'edit-tags.php?taxonomy='.AMP_Validation_Error_Taxonomy::TAXONOMY_SLUG.'&post_type=amp_validated_url')),esc_html__('View Error Index',$this->textDomain));} ?></div>               
                </div>
            </div>    
        </div>
    </div>
    <div class="daftplugAdminPage_content -flex6">
        <div class="daftplugAdminContentWrapper">
            <div class="daftplugAdminFbiaInfo -flexAuto <?php if (daftplugInstantify::getSetting('fbia') == 'off') { echo '-disabled'; } ?>">
                <h4 class="daftplugAdminFbiaInfo_title"><?php esc_html_e('Facebook Instant Articles', $this->textDomain); ?></h4>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('RSS Feed URL', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><a class="daftplugAdminLink" href="<?php if(daftplugInstantify::getSetting('fbia')=='off'){echo'#';}else{echo$this->daftplugInstantifyFbia->feedUrl;} ?>" target="_blank"><?php if(daftplugInstantify::getSetting('fbia')=='off'){echo'None';}else{esc_html_e('View RSS Feed URL', $this->textDomain);} ?></a></div>                
                </div>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('Validate Feed', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><?php if(daftplugInstantify::getSetting('fbia')=='off'){echo'None';}else{printf('<a class="daftplugAdminLink" href="%s" target="_blank">%s</a>',esc_url(add_query_arg('url',$this->daftplugInstantifyFbia->feedUrl,'https://podba.se/validate/')),esc_html__('View Feed Validation', $this->textDomain));} ?></div>               
                </div>
                <div class="daftplugAdminStatus_container">
                    <div class="daftplugAdminStatus_label -flex4"><?php esc_html_e('Article Count', $this->textDomain); ?></div>
                    <div class="daftplugAdminStatus_text -flex8"><?php if(daftplugInstantify::getSetting('fbia') == 'off'){echo'None';}else{echo$this->daftplugInstantifyFbia->getArticleCount();} ?></div>                
                </div>
            </div>    
        </div>
    </div>
</article>