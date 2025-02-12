jQuery(function() {
    'use strict';
    var daftplugAdmin = jQuery('.daftplugAdmin[data-daftplug-plugin="daftplug_instantify"]');
    var optionName = daftplugAdmin.attr('data-daftplug-plugin');
    var objectName = window[optionName + '_admin_js_vars'];

    function handleScheduleProgress(timeleft, timetotal, $element) {
        var percentLeft = (timeleft * 100 / timetotal);
        var year = Math.floor(timeleft / 31556926);
        var month = Math.floor(timeleft / 2628000);
        var day = Math.floor(timeleft / 86400);
        var hour = Math.floor(timeleft / 3600);
        var minute = Math.floor(timeleft / 60);
        var second = Math.floor(timeleft);
        var leftTime = [];
        
        if (year > 0) {
            leftTime.push(year, 'Year'+(year > 1 ? 's' : ''));
        } else if (month > 0) {
            leftTime.push(month, 'Month'+(month > 1 ? 's' : ''));
        } else if (day > 0) {
            leftTime.push(day, 'Day'+(day > 1 ? 's' : ''));
        } else if (hour > 0) {
            leftTime.push(hour, 'Hour'+(hour > 1 ? 's' : ''));
        } else if (minute > 0) {
            leftTime.push(minute, 'Minute'+(minute > 1 ? 's' : ''));
        } else if (second > 0) {
            leftTime.push(second, 'Second'+(second > 1 ? 's' : ''));
        } else {
            leftTime.push('', 'Sending');
            setTimeout(function() {
                $element.parent().fadeOut('fast');
            }, 2000);
        }

        if (percentLeft > 50) {
            var deg = 90 - (360 * timeleft / timetotal);
            $element.css('background-image',
                'linear-gradient(' + deg + 'deg, transparent 50%, #83a9fe 50%),linear-gradient(90deg, #83a9fe 50%, transparent 50%)'
            );
        } else {
            var deg = -90 - (360 * timeleft / timetotal);
            $element.css('background-image',
                'linear-gradient(' + deg + 'deg, transparent 50%, #fff 50%),linear-gradient(90deg, #83a9fe 50%, transparent 50%)'
            );
        }
        $element.find('.daftplugAdminScheduleProgress_numbers').html(leftTime[0]);
        $element.find('.daftplugAdminScheduleProgress_words').html(leftTime[1]);
        if (timeleft > 0) {
            setTimeout(function () {
                handleScheduleProgress(timeleft - 0.005, timetotal, $element);
            }, 5);
        }
    }

    function pickTextColorBasedOnBgColor(bgColor, lightColor, darkColor) {
        var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        var r = parseInt(color.substring(0, 2), 16);
        var g = parseInt(color.substring(2, 4), 16);
        var b = parseInt(color.substring(4, 6), 16);
        var uicolors = [r / 255, g / 255, b / 255];
        var c = uicolors.map((col) => {
          if (col <= 0.03928) {
            return col / 12.92;
          }
          return Math.pow((col + 0.055) / 1.055, 2.4);
        });
        var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
        return (L > 0.179) ? darkColor : lightColor;
    }
    
    function generateLaunchScreensAndMakableIcons() {
        var action = optionName + '_generate_launch_screens_and_maskable_icons';
        var canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2732;
        var image = new Image();
        image.src = jQuery('#pwaIcon').attr('data-attach-url');
        image.onload = function() {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = jQuery('#pwaBackgroundColor').val();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '90px Verdana';
            ctx.textAlign = 'center';
            ctx.fillStyle = pickTextColorBasedOnBgColor(jQuery('#pwaBackgroundColor').val(), '#FFFFFF', '#000000');
            ctx.fillText(jQuery('#pwaName').val(), canvas.width / 2, canvas.height - 200);
            ctx.drawImage(image,
              canvas.width / 2 - image.width / 2,
              canvas.height / 2 - image.height / 2
            );
    
            var launchScreen = canvas.toDataURL('image/png');
    
            canvas.width = 2000;
            canvas.height = 2000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image,
                canvas.width / 2 - image.width / 2,
                canvas.height / 2 - image.height / 2
            );
            var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
            l = pixels.data.length,
            i,
            bound = {
                top: null,
                left: null,
                right: null,
                bottom: null
            },
            x, y;
    
            for (i = 0; i < l; i += 4) {
                if (pixels.data[i + 3] !== 0) {
                    x = (i / 4) % canvas.width;
                    y = ~~((i / 4) / canvas.width);
    
                    if (bound.top === null) {
                        bound.top = y;
                    }
    
                    if (bound.left === null) {
                        bound.left = x;
                    } else if (x < bound.left) {
                        bound.left = x;
                    }
    
                    if (bound.right === null) {
                        bound.right = x;
                    } else if (bound.right < x) {
                        bound.right = x;
                    }
    
                    if (bound.bottom === null) {
                        bound.bottom = y;
                    } else if (bound.bottom < y) {
                        bound.bottom = y;
                    }
                }
            }
            
            var trimHeight = bound.bottom - bound.top,
                trimWidth = bound.right - bound.left,
                trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
    
            canvas.width = trimWidth;
            canvas.height = trimHeight;
            ctx.putImageData(trimmed, 0, 0);
    
            var canvas2 = document.createElement('canvas');
            var ctx2 = canvas2.getContext('2d');
            canvas2.width = 512;
            canvas2.height = 512;
            ctx2.drawImage(canvas, 0, 0, 512, 512);
    
            var maskableIcon = canvas2.toDataURL('image/png');
    
            jQuery.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: action,
                    launchScreen: launchScreen,
                    maskableIcon: maskableIcon,
                },
                beforeSend: function() {
                    
                },
                success: function(response, textStatus, jqXhr) {
                    
                },
                complete: function() {
    
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    
                }
            });
        };
    }
    
    daftplugAdmin.find('.daftplugAdminSettings_form').on('submit', function(e) {
        e.preventDefault();
        generateLaunchScreensAndMakableIcons();
    });

    // Handle loading all subscribers
    daftplugAdmin.on('click', '.daftplugAdminButton.-loadAllSubscribers', function(e) {
        var self = jQuery(this);
        var action = optionName + '_get_all_subscribers';
        var tableBody = daftplugAdmin.find('.daftplugAdminPage_subpage.-pushnotifications tbody');

        jQuery.ajax({
            url: ajaxurl,
            dataType: 'text',
            type: 'POST',
            data: {
                action: action,
            },
            beforeSend: function() {
                self.text('Loading...').addClass('-disabled');
            },
            success: function(response, textStatus, jqXhr) {
                var response = JSON.parse(response);
                self.hide();
                for (var [id, subscribedDevice] of Object.entries(response.data.subscribedDevices)) {
                    tableBody.append(`
                        <tr class="daftplugAdminTable_row">
                            <td class="daftplugAdminTable_data -deviceInfo">${subscribedDevice.deviceInfo}</td>
                            <td class="daftplugAdminTable_data -regDate">${subscribedDevice.date}</td>
                            <td class="daftplugAdminTable_data -country">${subscribedDevice.country}</td>
                            <td class="daftplugAdminTable_data -user">${subscribedDevice.user}</td>
                            <td class="daftplugAdminTable_data -actions">
                                <span class="daftplugAdminTable_action -send" data-subscription="${subscribedDevice.endpoint}" data-tooltip="Notify" data-tooltip-flow="top" data-open-popup="pushModal">
                                    <svg class="daftplugAdminTable_icon -iconBell">
                                        <use href="#iconBell"></use>
                                    </svg>
                                </span>
                                <span class="daftplugAdminTable_action -remove" data-subscription="${subscribedDevice.endpoint}" data-tooltip="Remove" data-tooltip-flow="top">
                                    <svg class="daftplugAdminTable_icon -iconRemove">
                                        <use href="#iconRemove"></use>
                                    </svg>
                                </span>
                            </td>
                        </tr>
                    `);
                }
            },
            complete: function() {

            },
            error: function(jqXhr, textStatus, errorThrown) {

            }
        });
    });

    // Handle populating segment select
    daftplugAdmin.on('click', '.daftplugAdminTable_action.-send, .daftplugAdminButton.-sendNotification', function(e) {
        var self = jQuery(this);
        var openPopup = self.attr('data-open-popup');
        var popup = daftplugAdmin.find('[data-popup="'+openPopup+'"]');
        var subscription = self.attr('data-subscription');
        var form = popup.find('.daftplugAdminSendPush_form');
        var pushSegmentSelect = form.find('#pushSegment');
        var pushSegmentDropdown = form.find('.daftplugAdminInputSelect_dropdown[data-name="pushSegment"]');
        var pushSegmentList = form.find('.daftplugAdminInputSelect_list[data-name="pushSegment"]');

        pushSegmentSelect.val(subscription);
        pushSegmentList.find('.daftplugAdminInputSelect_option.-selected').removeClass('-selected');
        pushSegmentList.find('.daftplugAdminInputSelect_option[data-value="'+subscription+'"]').addClass('-selected');
        pushSegmentDropdown.attr('data-value', subscription).text(pushSegmentList.find('.daftplugAdminInputSelect_option.-selected').find('.daftplugAdminInputSelect_text').text());
    });

    // Handle push subscriber remove
    daftplugAdmin.on('click', '.daftplugAdminPage_subpage.-pushnotifications .daftplugAdminTable_action.-remove', function(e) {
        var self = jQuery(this);
        var row = self.closest('.daftplugAdminTable_row');
        var action = optionName + '_handle_subscription';
        var method = 'remove';
        var endpoint = self.attr('data-subscription');

        jQuery.ajax({
            url: ajaxurl,
            dataType: 'text',
            type: 'POST',
            data: {
                action: action,
                method: method,
                endpoint: endpoint,
            },
            beforeSend: function() {
                row.addClass('-disabled');
            },
            success: function(response, textStatus, jqXhr) {
                row.remove();
            },
            complete: function() {

            },
            error: function(jqXhr, textStatus, errorThrown) {
                row.remove();
            }
        });
    });

    // Handle push subscribers filter
    daftplugAdmin.on('input paste', '#subscribersFilter', function(e) {
        var self = jQuery(this);
        var searchPhrase = self.val();           
        searchPhrase = jQuery.trim(searchPhrase).replace(/ +/g, ' ').toLowerCase();
        daftplugAdmin.find('tbody').find('.daftplugAdminTable_row').show().filter(function(e) {
            var a = jQuery(this).text().replace(/\s+/g, ' ').toLowerCase();
            return -1 === a.indexOf(searchPhrase)
        }).hide();
    });

    // Handle send push notification
    daftplugAdmin.find('.daftplugAdminSendPush_form').on('submit', function(e) {
        e.preventDefault();
        var self = jQuery(this);
        var scheduledCardFieldset = daftplugAdmin.find('.daftplugAdminFieldset_schedules');
        var popup = daftplugAdmin.find('[data-popup="pushModal"]');
        var button = self.find('.daftplugAdminButton.-submit');
        var responseText = self.find('.daftplugAdminField_response');
        var action = optionName + '_send_notification';
        var nonce = self.attr('data-nonce');
        var pushImage = self.find('#pushImage');
        var pushIcon = self.find('#pushIcon');
        var inputs = self.find(':input');
        var notificationData = self.daftplugSerialize();

        jQuery.ajax({
            url: ajaxurl,
            dataType: 'text',
            type: 'POST',
            data: {
                action: action,
                nonce: nonce,
                notificationData: notificationData,
            },
            beforeSend: function() {
                responseText.fadeOut('fast', function() {
                    responseText.empty().show();
                });
                button.addClass('-loading');
            },
            success: function(response, textStatus, jqXhr) {
                var response = JSON.parse(response);
                if (response.success) {
                    button.addClass('-success');
                    setTimeout(function() {
                        button.removeClass('-loading -success');
                    }, 1500);
                    responseText.css('color', '#2967f7').html(response.data.message).fadeIn('fast').delay(10000).fadeOut('fast', function() {
                        responseText.empty().show();
                    });
                    self.trigger('reset');
                    pushImage.val('').removeClass('-hasFile').removeAttr('data-attach-url');
                    pushIcon.val('').removeClass('-hasFile').removeAttr('data-attach-url');
                    self.find('.daftplugAdminMiniFieldset_close').trigger('click');
                    inputs.trigger('change');
                    if (response.data.scheduled) {
                        scheduledCardFieldset.append(`
                            <span class="daftplugAdminSchedule">
                                <div class="daftplugAdminScheduleProgress" data-timeleft="${response.data.timeleft}" data-timetotal="${response.data.timetotal}">
                                    <div class="daftplugAdminScheduleProgress_circle"></div>
                                    <div class="daftplugAdminScheduleProgress_timer">
                                        <div class="daftplugAdminScheduleProgress_numbers"></div>
                                        <div class="daftplugAdminScheduleProgress_words"></div>
                                    </div>
                                </div>
                                <div class="daftplugAdminSchedule_meta">
                                    <div class="daftplugAdminSchedule_date">${response.data.date}</div>
                                    <div class="daftplugAdminSchedule_time">${response.data.time}</div>
                                    <div class="daftplugAdminSchedule_actions -actions">
                                        <span class="daftplugAdminSchedule_action -send" data-action="send" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Send Now" data-tooltip-flow="bottom">
                                            <svg class="daftplugAdminSchedule_icon -iconSend">
                                                <use href="#iconBell"></use>
                                            </svg>
                                        </span>
                                        <span class="daftplugAdminSchedule_action -edit" data-action="edit" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Edit" data-tooltip-flow="bottom" data-open-popup="scheduledPushModal">
                                            <svg class="daftplugAdminSchedule_icon -iconEdit">
                                                <use href="#iconEdit"></use>
                                            </svg>
                                        </span>
                                        <span class="daftplugAdminSchedule_action -remove" data-action="remove" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Remove" data-tooltip-flow="bottom">
                                            <svg class="daftplugAdminSchedule_icon -iconRemove">
                                                <use href="#iconRemove"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </span>
                        `).css({'padding': '10px 0', 'margin': '25px',});

                        var progressElm = scheduledCardFieldset.find('.daftplugAdminScheduleProgress:last');
                        var timeleft = response.data.timeleft;
                        var timetotal = response.data.timetotal;
                
                        handleScheduleProgress(timeleft, timetotal, progressElm);
                    }
                } else {
                    button.addClass('-fail');
                    setTimeout(function() {
                        button.removeClass('-loading -fail');
                    }, 1500);
                    responseText.css('color', '#ff4734').html(response.data.message).fadeIn('fast');
                }
            },
            complete: function() {

            },
            error: function(jqXhr, textStatus, errorThrown) {
                button.addClass('-fail');
                setTimeout(function() {
                    button.removeClass('-loading -fail');
                }, 1500);
                responseText.css('color', '#ff4734').html('There was an error in system.').fadeIn('fast');

                console.log(jqXhr);
            }
        });
    });

    // Handle installation overlays edit previews
    daftplugAdmin.find('.daftplugAdminPopup[data-popup^="pwaOverlaysType"]').each(function(e) {
        var self = jQuery(this);
        var type = self.attr('data-popup').replace('pwaOverlaysType', '');
        var preview = self.find('.pwaOverlaysType'+type+'Preview');
        var close = preview.find('.pwaOverlaysType'+type+'Preview_close');
        var title = preview.find('.pwaOverlaysType'+type+'Preview_title');
        var text = preview.find('.pwaOverlaysType'+type+'Preview_text');
        var notnow = preview.find('.pwaOverlaysType'+type+'Preview_notnow');
        var button = preview.find('.pwaOverlaysType'+type+'Preview_button');
        var textField = self.find('#pwaOverlaysType'+type+'Message');
        var bgColorField = self.find('#pwaOverlaysType'+type+'BackgroundColor');
        var textColorField = self.find('#pwaOverlaysType'+type+'TextColor');
        var percentageField = self.find('#pwaOverlaysType'+type+'Percentage');
        var selectOption = self.find('.daftplugAdminInputSelect_option');

        textField.on('input change', function(e) {
            text.text(textField.val());
        });

        bgColorField.on('input change', function(e) {
            preview.css('background', bgColorField.val());
            button.css('color', bgColorField.val());
        });

        textColorField.on('input change', function(e) {
            if (type == 'Header') {
                title.add(text).css('color', textColorField.val());
                close.css('stroke', textColorField.val());
            } else if (type == 'Snackbar') {
                title.add(text).css('color', textColorField.val());
            } else {
                text.add(notnow).css('color', textColorField.val());
            }

            button.css('background', textColorField.val());
        });

        percentageField.on('change', function(e) {
            title.text(title.text().replace(/[0-9]+/, percentageField.val()));
        });
        
        selectOption.on('click', function(e) {
            percentageField.trigger('change');
        });
    });

    // Handle PWA custom CSS editor
    daftplugAdmin.find('#pwaCustomCss').each(function(e) {
        var self = jQuery(this);
        var pwaCustomCssCmEditorSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
        pwaCustomCssCmEditorSettings.codemirror = _.extend(
            {},
            pwaCustomCssCmEditorSettings.codemirror,
            {
                lineNumbers: true,
                mode: 'css',
                indentUnit: 4,
                tabSize: 4,
                autoRefresh:true,
                lint: true,
            }
        );
        var pwaCustomCssCmEditor = wp.codeEditor.initialize(self, pwaCustomCssCmEditorSettings);
        daftplugAdmin.on('keyup paste', '.CodeMirror-code', function(e) {
            self.html(pwaCustomCssCmEditor.codemirror.getValue()).trigger('change');
        });
    });

    // Handle preview notification
    daftplugAdmin.find('.daftplugAdminButton.-preview').on('click', function(e) {
        e.preventDefault();
        var self = jQuery(this);
        var form = self.closest('form');
        var pushTitle = form.find('#pushTitle').val();
        var pushBody = form.find('#pushBody').val();
        var pushImage = form.find('#pushImage').attr('data-attach-url');
        var pushIcon = form.find('#pushIcon').attr('data-attach-url');
        var pushFixed = form.find('#pushFixed');

        if (!('Notification' in window)) {
            self.attr({
                'data-tooltip': 'Notifications are not supported in your browser',
                'data-tooltip-flow': 'top',
            });
        } else {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        new Notification(pushTitle, {
                            body: pushBody,
                            image: pushImage,
                            icon: pushIcon,
                            tag: 'notification',
                            renotify: true,
                            requireInteraction: pushFixed.is(':checked') ? true : false,
                            vibrate: [],
                        });
                    } else {
                        self.attr({
                            'data-tooltip': 'Sending notifications are not allowed in your browser',
                            'data-tooltip-flow': 'top',
                        });
                    }
                });
            } else if (Notification.permission === 'denied') {
                self.attr({
                    'data-tooltip': 'Sending notifications are not allowed in your browser',
                    'data-tooltip-flow': 'top',
                });
            } else {
                new Notification(pushTitle, {
                    body: pushBody,
                    image: pushImage,
                    icon: pushIcon,
                    tag: 'renotify',
                    renotify: true,
                    requireInteraction: pushFixed.is(':checked') ? true : false,
                    vibrate: [],
                });
            }
        }
    });

    // Handle scheduled notification cards container margin
    daftplugAdmin.find('.daftplugAdminFieldset_schedules').each(function(e) {
        var self = jQuery(this);
        if (self.children().length == 0) {
            self.css({
                'padding': '0',
                'margin': '0',
            });
        }
    });

    // Handle scheduled notification cards
    daftplugAdmin.find('.daftplugAdminSchedule').each(function(e) {
        var self = jQuery(this);
        var progressElm = self.find('.daftplugAdminScheduleProgress');
        var timeleft = progressElm.attr('data-timeleft');
        var timetotal = progressElm.attr('data-timetotal');

        handleScheduleProgress(timeleft, timetotal, progressElm);
    });

    // Handle populating scheduled notifications edit form
    daftplugAdmin.on('click', '.daftplugAdminPage_subpage.-pushnotifications .daftplugAdminSchedule_action.-edit', function(e) {
        var self = jQuery(this);
        var notificationData = JSON.parse(self.attr('data-args')).notificationData;
        var popup = daftplugAdmin.find('[data-popup="scheduledPushModal"]');
        var form = popup.find('.daftplugAdminScheduledPush_form');
        var inputs = form.find(':input');
        var addFieldButton = form.find('.daftplugAdminButton.-addField');
        var miniFieldsetClose = form.find('.daftplugAdminMiniFieldset_close');
        var pushSegment = form.find('#pushSegment');
        var pushSegmentList = form.find('.daftplugAdminInputSelect_list[data-name="pushSegment"]');
        var pushSegmentDropdown = form.find('.daftplugAdminInputSelect_dropdown[data-name="pushSegment"]');
        var pushTitle = form.find('#pushTitle');
        var pushBody = form.find('#pushBody');
        var pushImage = form.find('#pushImage');
        var pushUrl = form.find('#pushUrl');
        var pushIcon = form.find('#pushIcon');
        var pushVibrate = form.find('#pushVibrate');
        var pushFixed = form.find('#pushFixed');
        var pushScheduledDatetime = form.find('#pushScheduledDatetime');

        pushSegment.val(notificationData.pushSegment);
        pushSegmentList.find('.daftplugAdminInputSelect_option.-selected').removeClass('-selected');
        pushSegmentList.find('.daftplugAdminInputSelect_option[data-value="'+notificationData.pushSegment+'"]').addClass('-selected');
        pushSegmentDropdown.attr('data-value', notificationData.pushSegment).text(pushSegmentList.find('.daftplugAdminInputSelect_option.-selected').find('.daftplugAdminInputSelect_text').text());
        pushTitle.val(notificationData.pushTitle);
        pushBody.val(notificationData.pushBody);
        pushUrl.val(notificationData.pushUrl);
        pushScheduledDatetime.val(notificationData.pushScheduledDatetime);
        form.attr({
            'data-time': self.attr('data-time'),
            'data-args': self.attr('data-args'),
        });

        if (notificationData.pushImage) {
            wp.media.attachment(notificationData.pushImage).fetch().then(function(data) {
                var image = wp.media.attachment(notificationData.pushImage).get('url');
                pushImage.val(notificationData.pushImage).attr('data-attach-url', image).addClass('-hasFile').next().find('image').attr('href', image);
            });
        }

        if (notificationData.pushIcon) {
            wp.media.attachment(notificationData.pushIcon).fetch().then(function(data) {
                var image = wp.media.attachment(notificationData.pushIcon).get('url');
                pushIcon.val(notificationData.pushIcon).attr('data-attach-url', image).addClass('-hasFile').next().find('image').attr('href', image);
            });
        }

        if (notificationData.pushVibrate == 'on') {
            pushVibrate.prop('checked', true);
        }

        if (notificationData.pushFixed == 'on') {
            pushFixed.prop('checked', true);
        }

        if (notificationData.pushActionButton1 == 'on') {
            addFieldButton.trigger('click');
            form.find('#pushActionButton1Text').val(notificationData.pushActionButton1Text);
            form.find('#pushActionButton1Url').val(notificationData.pushActionButton1Url);
        }

        if (notificationData.pushActionButton2 == 'on') {
            addFieldButton.trigger('click');
            form.find('#pushActionButton2Text').val(notificationData.pushActionButton2Text);
            form.find('#pushActionButton2Url').val(notificationData.pushActionButton2Url);
        }

        inputs.trigger('change');

        popup.not('.daftplugAdminPopup_container').on('click', function(e) {
            form.trigger('reset');
            inputs.trigger('change');
            pushImage.add(pushIcon).val('').removeAttr('data-attach-url').removeClass('-hasFile').next().find('image').removeAttr('href');
            miniFieldsetClose.trigger('click');
        });
    });

    // Handle scheduled notification edit
    daftplugAdmin.find('.daftplugAdminScheduledPush_form').on('submit', function(e) {
        e.preventDefault();
        var self = jQuery(this);
        var scheduledCardFieldset = daftplugAdmin.find('.daftplugAdminFieldset_schedules');
        var popup = daftplugAdmin.find('[data-popup="scheduledPushModal"]');
        var button = self.find('.daftplugAdminButton.-submit');
        var responseText = self.find('.daftplugAdminField_response');
        var miniFieldsetClose = self.find('.daftplugAdminMiniFieldset_close');
        var action = optionName + '_handle_scheduled_notification';
        var method = 'edit';
        var time = self.attr('data-time');
        var args = self.attr('data-args');
        var pushImage = self.find('#pushImage');
        var pushIcon = self.find('#pushIcon');
        var inputs = self.find(':input');
        var notificationData = self.daftplugSerialize();

        jQuery.ajax({
            url: ajaxurl,
            dataType: 'text',
            type: 'POST',
            data: {
                action: action,
                method: method,
                time: time,
                args: args,
                notificationData: notificationData,
            },
            beforeSend: function() {
                button.addClass('-loading');
            },
            success: function(response, textStatus, jqXhr) {
                var response = JSON.parse(response);
                if (response.data.scheduled) {
                    button.addClass('-success');
                    setTimeout(function() {
                        button.removeClass('-loading -success');
                    }, 1500);
                    responseText.css('color', '#2967f7').html(response.data.message).fadeIn('fast').delay(3000).fadeOut('fast', function() {
                        responseText.empty().show();
                    });
                    self.trigger('reset');
                    pushImage.add(pushIcon).val('').removeClass('-hasFile').removeAttr('data-attach-url');
                    miniFieldsetClose.trigger('click');
                    inputs.trigger('change');
                    scheduledCardFieldset.append(`
                        <span class="daftplugAdminSchedule">
                            <div class="daftplugAdminScheduleProgress" data-timeleft="${response.data.timeleft}" data-timetotal="${response.data.timetotal}">
                                <div class="daftplugAdminScheduleProgress_circle"></div>
                                <div class="daftplugAdminScheduleProgress_timer">
                                    <div class="daftplugAdminScheduleProgress_numbers"></div>
                                    <div class="daftplugAdminScheduleProgress_words"></div>
                                </div>
                            </div>
                            <div class="daftplugAdminSchedule_meta">
                                <div class="daftplugAdminSchedule_date">${response.data.date}</div>
                                <div class="daftplugAdminSchedule_time">${response.data.time}</div>
                                <div class="daftplugAdminSchedule_actions -actions">
                                    <span class="daftplugAdminSchedule_action -send" data-action="send" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Send Now" data-tooltip-flow="bottom">
                                        <svg class="daftplugAdminSchedule_icon -iconSend">
                                            <use href="#iconBell"></use>
                                        </svg>
                                    </span>
                                    <span class="daftplugAdminSchedule_action -edit" data-action="edit" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Edit" data-tooltip-flow="bottom" data-open-popup="scheduledPushModal">
                                        <svg class="daftplugAdminSchedule_icon -iconEdit">
                                            <use href="#iconEdit"></use>
                                        </svg>
                                    </span>
                                    <span class="daftplugAdminSchedule_action -remove" data-action="remove" data-time="${response.data.datetime}" data-args='${JSON.stringify(response.data.args)}' data-tooltip="Remove" data-tooltip-flow="bottom">
                                        <svg class="daftplugAdminSchedule_icon -iconRemove">
                                            <use href="#iconRemove"></use>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </span>
                    `).css({'padding': '10px 0', 'margin': '25px',}).find(`[data-time="${response.data.oldSchedule}"]`).closest('.daftplugAdminSchedule').remove();
            
                    var progressElm = scheduledCardFieldset.find('.daftplugAdminScheduleProgress:last');
                    var timeleft = response.data.timeleft;
                    var timetotal = response.data.timetotal;
            
                    handleScheduleProgress(timeleft, timetotal, progressElm);
                    setTimeout(function() {
                        popup.removeClass('-active');
                    }, 2000);
                } else {
                    button.addClass('-fail');
                    setTimeout(function() {
                        button.removeClass('-loading -fail');
                    }, 1500);
                    responseText.css('color', '#ff4734').html(response.data.message).fadeIn('fast');
                }
            },
            complete: function() {

            },
            error: function(jqXhr, textStatus, errorThrown) {
                button.addClass('-fail');
                setTimeout(function() {
                    button.removeClass('-loading -fail');
                }, 1500);
                responseText.css('color', '#ff4734').html('Push notification failed.').fadeIn('fast');

                console.log(jqXhr);
            }
        });
    });

    // Handle scheduled notification send and remove
    daftplugAdmin.on('click', '.daftplugAdminPage_subpage.-pushnotifications .daftplugAdminSchedule_action:not(.-edit)', function(e) {
        var self = jQuery(this);
        var scheduledCardFieldset = daftplugAdmin.find('.daftplugAdminFieldset_schedules');
        var scheduledCard = self.closest('.daftplugAdminSchedule');
        var timer = scheduledCard.find('.daftplugAdminScheduleProgress_timer');
        var action = optionName + '_handle_scheduled_notification';
        var method = self.attr('data-action');
        var time = self.attr('data-time');
        var args = self.attr('data-args');

        jQuery.ajax({
            url: ajaxurl,
            dataType: 'text',
            type: 'POST',
            data: {
                action: action,
                method: method,
                time: time,
                args: args,
            },
            beforeSend: function() {
                scheduledCard.addClass('-disabled');
                if (method == 'send') {
                    timer.replaceWith(`<div class="daftplugAdminScheduleProgress_timer">Sending</div>`);
                }
            },
            success: function(response, textStatus, jqXhr) {
                var response = JSON.parse(response); 
                if (response.success) {
                    scheduledCard.remove();
                    if (scheduledCardFieldset.children().length == 0) {
                        scheduledCardFieldset.css({
                            'padding': '0',
                            'margin': '0',
                        });
                    }
                }
            },
            complete: function() {

            },
            error: function(jqXhr, textStatus, errorThrown) {
                scheduledCard.remove();
                if (scheduledCardFieldset.children().length == 0) {
                    scheduledCardFieldset.css({
                        'padding': '0',
                        'margin': '0',
                    });
                }
                console.log(jqXhr);
            }
        });
    });

    // Generate PWA installer analytics
    jQuery.ajax({
        url: ajaxurl,
        dataType: 'json',
        type: 'POST',
        data: {
            action: optionName + '_get_installer_analytics',
        },
        beforeSend: function() {

        },
        success: function(response, textStatus, jqXhr) {
            var ctx = document.getElementById('daftplugAdminInstallerAnalytics_chart');
            var labels = Object.keys(response.data);
            var data = Object.values(response.data);            
            var installerAnalyticsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.slice(Math.max(labels.length - 7, 0)),
                    datasets: [{
                        label: 'Installs',
                        lineTension: 0.3,
                        backgroundColor: '#eceffc',
                        borderColor: '#2967f7',
                        pointRadius: 3,
                        pointBackgroundColor: '#2967f7',
                        pointBorderColor: '#2967f7',
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: '#2960ea',
                        pointHoverBorderColor: '#2960ea',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: data.slice(Math.max(data.length - 7, 0)),
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10
                        }
                    },
                    scales: {
                        xAxes: [{
                            time: {
                                unit: 'date'
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                maxTicksLimit: 30,
                                padding: 10
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 10,
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                            },
                            gridLines: {
                                color: '#eceffc',
                                zeroLineColor: '#eceffc',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }],
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        titleMarginBottom: 10,
                        titleFontColor: '#676d7c',
                        titleFontSize: 14,
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10
                    }
                }
            });

            daftplugAdmin.find('.daftplugAdminInstallerAnalytics_buttons .daftplugAdminButton.-analyticsButton').on('click', function(e) {
                var self = jQuery(this);
                var period = self.attr('data-period');
                daftplugAdmin.find('.daftplugAdminInstallerAnalytics_buttons .daftplugAdminButton.-analyticsButton.-active').removeClass('-active');
                self.addClass('-active');
                switch (period) {
                    case "1week":
                        var newLabels = labels.slice(Math.max(labels.length - 7, 0));
                        var newData = data.slice(Math.max(data.length - 7, 0));
                    break;
                    case "1month":
                        var newLabels = labels.slice(Math.max(labels.length - 30, 0));
                        var newData = data.slice(Math.max(data.length - 30, 0));
                    break;
                    case "3month":
                        var newLabels = labels.slice(Math.max(labels.length - 90, 0));
                        var newData = data.slice(Math.max(data.length - 90, 0));
                    break;
                    case "6month":
                        var newLabels = labels.slice(Math.max(labels.length - 182, 0));
                        var newData = data.slice(Math.max(data.length - 182, 0));
                    break;
                    case "1year":
                        var newLabels = labels;
                        var newData = data;
                    break;
                    default:
                        var newLabels = labels.slice(Math.max(labels.length - 7, 0));
                        var newData = data.slice(Math.max(data.length - 7, 0));
                    break;
                }

                installerAnalyticsChart.data.labels = newLabels;
                installerAnalyticsChart.data.datasets.forEach((dataset) => {
                    dataset.data = newData;
                });
                installerAnalyticsChart.update();
            });
        },
        complete: function() {

        },
        error: function(jqXhr, textStatus, errorThrown) {

        }
    });

    // Generate PWA installer stats
    jQuery.ajax({
        url: ajaxurl,
        dataType: 'json',
        type: 'POST',
        data: {
            action: optionName + '_get_installer_stats',
        },
        beforeSend: function() {

        },
        success: function(response, textStatus, jqXhr) {
            var browserCtx = document.getElementById('daftplugAdminInstallerStats_chartBrowser');
            var deviceCtx = document.getElementById('daftplugAdminInstallerStats_chartDevice');
            var countryCtx = document.getElementById('daftplugAdminInstallerStats_chartCountry');
            var statusCtx = document.getElementById('daftplugAdminInstallerStats_chartStatus');
            var browserNames = response.data.browserNames;
            var browserCount = response.data.browserCount;
            var browserColors = [];
            var deviceNames = response.data.deviceNames;
            var deviceCount = response.data.deviceCount;
            var deviceColors = [];
            var countryNames = response.data.countryNames;
            var countryCount = response.data.countryCount;
            var countryColors = [];
            var statusNames = response.data.statusNames;
            var statusCount = response.data.statusCount;
            var statusColors = [];

            for (let i=0; i<browserNames.length; i++){
                browserColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<deviceNames.length; i++){
                deviceColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<countryNames.length; i++){
                countryColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<statusNames.length; i++){
                statusColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            var browserPie = new Chart(browserCtx, {
                type: 'doughnut',
                data: {
                    labels: browserNames,
                    datasets: [{
                        data: browserCount,
                        backgroundColor: browserColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var devicePie = new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: deviceNames,
                    datasets: [{
                        data: deviceCount,
                        backgroundColor: deviceColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var countryPie = new Chart(countryCtx, {
                type: 'doughnut',
                data: {
                    labels: countryNames,
                    datasets: [{
                        data: countryCount,
                        backgroundColor: countryColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var statusPie = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: statusNames,
                    datasets: [{
                        data: statusCount,
                        backgroundColor: statusColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });
        },
        complete: function() {

        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.log(jqXhr);
        }
    });

    // Generate subscriber analytics
    jQuery.ajax({
        url: ajaxurl,
        dataType: 'json',
        type: 'POST',
        data: {
            action: optionName + '_get_subscriber_analytics',
        },
        beforeSend: function() {

        },
        success: function(response, textStatus, jqXhr) {
            var ctx = document.getElementById('daftplugAdminSubscriberAnalytics_chart');
            var labels = Object.keys(response.data);
            var data = Object.values(response.data);
            var subscriberAnalyticsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.slice(Math.max(labels.length - 7, 0)),
                    datasets: [{
                        label: 'Subscribers',
                        lineTension: 0.3,
                        backgroundColor: '#eceffc',
                        borderColor: '#2967f7',
                        pointRadius: 3,
                        pointBackgroundColor: '#2967f7',
                        pointBorderColor: '#2967f7',
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: '#2960ea',
                        pointHoverBorderColor: '#2960ea',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: data.slice(Math.max(data.length - 7, 0)),
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10
                        }
                    },
                    scales: {
                        xAxes: [{
                            time: {
                                unit: 'date'
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                maxTicksLimit: 30,
                                padding: 10
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 10,
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value;}}
                            },
                            gridLines: {
                                color: '#eceffc',
                                zeroLineColor: '#eceffc',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }],
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        titleMarginBottom: 10,
                        titleFontColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10
                    }
                }
            });

            daftplugAdmin.find('.daftplugAdminSubscriberAnalytics_buttons .daftplugAdminButton.-analyticsButton').on('click', function(e) {
                var self = jQuery(this);
                var period = self.attr('data-period');
                daftplugAdmin.find('.daftplugAdminSubscriberAnalytics_buttons .daftplugAdminButton.-analyticsButton.-active').removeClass('-active');
                self.addClass('-active');
                switch (period) {
                    case "1week":
                        var newLabels = labels.slice(Math.max(labels.length - 7, 0));
                        var newData = data.slice(Math.max(data.length - 7, 0));
                    break;
                    case "1month":
                        var newLabels = labels.slice(Math.max(labels.length - 30, 0));
                        var newData = data.slice(Math.max(data.length - 30, 0));
                    break;
                    case "3month":
                        var newLabels = labels.slice(Math.max(labels.length - 90, 0));
                        var newData = data.slice(Math.max(data.length - 90, 0));
                    break;
                    case "6month":
                        var newLabels = labels.slice(Math.max(labels.length - 182, 0));
                        var newData = data.slice(Math.max(data.length - 182, 0));
                    break;
                    case "1year":
                        var newLabels = labels;
                        var newData = data;
                    break;
                    default:
                        var newLabels = labels.slice(Math.max(labels.length - 7, 0));
                        var newData = data.slice(Math.max(data.length - 7, 0));
                    break;
                }

                subscriberAnalyticsChart.data.labels = newLabels;
                subscriberAnalyticsChart.data.datasets.forEach((dataset) => {
                    dataset.data = newData;
                });
                subscriberAnalyticsChart.update();
            });
        },
        complete: function() {

        },
        error: function(jqXhr, textStatus, errorThrown) {

        }
    });

    // Generate subscriber stats
    jQuery.ajax({
        url: ajaxurl,
        dataType: 'json',
        type: 'POST',
        data: {
            action: optionName + '_get_subscriber_stats',
        },
        beforeSend: function() {

        },
        success: function(response, textStatus, jqXhr) {
            var browserCtx = document.getElementById('daftplugAdminSubscriberStats_chartBrowser');
            var deviceCtx = document.getElementById('daftplugAdminSubscriberStats_chartDevice');
            var countryCtx = document.getElementById('daftplugAdminSubscriberStats_chartCountry');
            var statusCtx = document.getElementById('daftplugAdminSubscriberStats_chartStatus');
            var browserNames = response.data.browserNames;
            var browserCount = response.data.browserCount;
            var browserColors = [];
            var deviceNames = response.data.deviceNames;
            var deviceCount = response.data.deviceCount;
            var deviceColors = [];
            var countryNames = response.data.countryNames;
            var countryCount = response.data.countryCount;
            var countryColors = [];
            var statusNames = response.data.statusNames;
            var statusCount = response.data.statusCount;
            var statusColors = [];

            for (let i=0; i<browserNames.length; i++){
                browserColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<deviceNames.length; i++){
                deviceColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<countryNames.length; i++){
                countryColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            for (let i=0; i<statusNames.length; i++){
                statusColors.push('#'+((1<<24)*Math.random()|0).toString(16));
            }

            var browserPie = new Chart(browserCtx, {
                type: 'doughnut',
                data: {
                    labels: browserNames,
                    datasets: [{
                        data: browserCount,
                        backgroundColor: browserColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var devicePie = new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: deviceNames,
                    datasets: [{
                        data: deviceCount,
                        backgroundColor: deviceColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var countryPie = new Chart(countryCtx, {
                type: 'doughnut',
                data: {
                    labels: countryNames,
                    datasets: [{
                        data: countryCount,
                        backgroundColor: countryColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });

            var statusPie = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: statusNames,
                    datasets: [{
                        data: statusCount,
                        backgroundColor: statusColors,
                        hoverBorderColor: '#e5eaef',
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: '#fff',
                        bodyFontColor: '#8b98a9',
                        borderColor: '#e5eaef',
                        borderWidth: 1,
                        xPadding: 10,
                        yPadding: 10,
                        displayColors: false,
                        caretPadding: 10,
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true,
                        }
                    },
                    cutoutPercentage: 60,
                },
            });
        },
        complete: function() {

        },
        error: function(jqXhr, textStatus, errorThrown) {
            console.log(jqXhr);
        }
    });

    // Helpers
	jQuery.fn.daftplugSerialize = function() {
	    var data = {};
	    jQuery.each(this.serializeArray(), function() {
            if (data[this.name]) {
                if (!data[this.name].push) {
                    data[this.name] = [data[this.name]];
                }
                data[this.name].push(this.value || '');
            } else if (this.name.includes(']')) {
                var nestedArray = this.name.split("[").map(s => s.replace(']', ''));
                var headName = nestedArray[0];
                nestedArray.shift();
                var nestedValue = nestedArray.reduceRight((all, item) => ({[item]: all}), this.value);
                data[headName] = nestedValue;
            } else {
                data[this.name] = this.value || '';
            }
	    });
	    jQuery.each(jQuery('input[type=radio], input[type=checkbox]', this), function() {
	        if (!data.hasOwnProperty(this.name)) {
	            data[this.name] = 'off';
	        }
	    });
	    return JSON.stringify(data);
	};
});