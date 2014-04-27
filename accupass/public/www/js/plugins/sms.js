
var native_accessor = {

    send_sms: function (phone, message) {
        console.log(phone,message);
//        native_access.send_sms({"receivers":[{"name":'name', "phone":phone}]}, {"message_content":message});
    },

    receive_message: function (json_message) {
        //console.log(json_message);
        if (typeof this.process_received_message === 'function') {
            this.process_received_message(json_message);
        }
    },
    process_received_message : function(json_message){
        var  fore_two_strings = ApplyMessages.fore_two_string(json_message);
        function judge_message() {
            var judge_message = {
                BM: function() {
                    if(ApplyMessages.get_start_activity()){
                        var received_message = new ApplyMessages(json_message);
                        if(received_message.have_applied()){
                            native_accessor.send_sms(received_message.phone,"已报名");
                            return;
                        }
                        received_message.save_apply_messages();
                        ApplyMessages.refresh_sign_up_page();
                        native_accessor.send_sms(received_message.phone,"恭喜！报名成功");
                        return;
                    }
                    var activity= _.find(JSON.parse(localStorage.getItem("activities")),function(activity) {
                        return activity.name == localStorage.getItem("enter_into_it")
                    });
                    if(activity.status == "over"){
                        native_accessor.send_sms(received_message.phone,"活动已结束");
                        return;
                    }
                    native_accessor.send_sms(received_message.phone,"活动尚未开始");
                },
                JJ: function() {
                    if(isNaN(BidMessages.get_price(json_message))){
                        return;
                    }
                    if(BidMessages.get_start_bid()){
                        if(BidMessages.no_find_applied(json_message)){
                            native_accessor.send_sms(json_message.messages[0].phone,"对不起，您没有报名此次活动！");
                            return;
                        }
                        var bid_message =new BidMessages(json_message);
                        if(bid_message.have_bid()){
                            native_accessor.send_sms(json_message.messages[0].phone,"您已成功出价，请勿重复出价");
                            return;
                        }
                        bid_message.save_bid_message();
                        BidMessages.refresh_bid_apply_page();
                        native_accessor.send_sms(json_message.messages[0].phone,"恭喜！您已出价成功");
                        return;
                    }
                    var current_bid = BidMessages.get_last_bid();
                    if(current_bid.status == "default"){
                        native_accessor.send_sms(json_message.messages[0].phone,"对不起，活动尚未开始！");
                    }
                    if(current_bid.status == "over"){
                        native_accessor.send_sms(json_message.messages[0].phone,"对不起，活动已结束！");
                    }
                }
            }
            if(judge_message[fore_two_strings]) {
                judge_message[fore_two_strings]()
            }
        }
        judge_message();
    }
};
function notify_message_received(message_json) {
//    console.log(JSON.stringify(message_json));
    //JSON.stringify(message_json);
    //alert(JSON.stringify(message_json.messages));
    native_accessor.receive_message(message_json);
    //phone_number=message_json.messages[0].phone;
}