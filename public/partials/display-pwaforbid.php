<?php

if (!defined('ABSPATH')) exit;

$appIcon = @wp_get_attachment_image_src(daftplugInstantify::getSetting('pwaIcon'), array(150, 150))[0];
$appName = daftplugInstantify::getSetting('pwaName');

?>

<div class="daftplugPublicPwaForbid">
    <img class="daftplugPublicPwaForbid_icon" src="<?php echo $appIcon; ?>"/>
    <div class="daftplugPublicPwaForbid_title"><?php echo $appName; ?></div>
    <div class="daftplugPublicPwaForbid_message"><?php esc_html_e('PWA is disabled! Please use normal browser to access the website.', $this->textDomain); ?></div>
</div>