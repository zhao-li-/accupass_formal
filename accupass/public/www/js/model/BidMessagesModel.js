function BidMessages(json_message){
    var bid_start = BidMessages.get_start_bid();
    this.activity_name =bid_start.activity_name;
    this.bid_id = bid_start.bid_id;
    this.phone = json_message.messages[0].phone;
    this.user_name = BidMessages.get_the_message(json_message).user_name;
    this.price = BidMessages.get_price(json_message);
    this.current_user=localStorage.current_user
}

BidMessages.get_bid_messages = function(){
    return JSON.parse(localStorage.getItem("bid_messages")) || [];
}

BidMessages.get_price = function(json_message){
    return json_message.messages[0].message.replace(/\s/g, "").substring(2);
}

BidMessages.get_start_bid = function (){
    return _.find(JSON.parse(localStorage.getItem("bid_infos")),function(bid_info){
        return bid_info.status == "start" && bid_info.current_user == localStorage.current_user
    })
}

BidMessages.get_last_bid = function(){
    return  _.find(JSON.parse(localStorage.getItem("bid_infos")),function(bid_info){
        console.log(bid_info.activity_name)
        console.log(Activity.get_current_activity_name())
        console.log(bid_info.bid_id)
        console.log(Bid.get_current_bid_id())
        console.log(bid_info.current_user)
        return bid_info.activity_name == Activity.get_current_activity_name() && bid_info.bid_id == Bid.get_current_bid_id() && bid_info.current_user==localStorage.current_user
    })
}

BidMessages.no_find_applied = function (json_message){
    var phone = this.phone;
    if(_.find(ApplyMessages.get_apply_messages(),function(received_message){
        return received_message.phone == phone && received_message.activity_name == BidMessages.get_start_bid().activity_name &&received_message.current_user==localStorage.current_user
    })){
        return false;
    }
    return true;
}

BidMessages.have_bid = function (json_message){
    var phone = json_message.messages[0].phone;
    if(_.find(BidMessages.get_bid_messages(),function(bid_message){
        return bid_message.phone == phone && bid_message.activity_name== BidMessages.get_start_bid().activity_name &&bid_message.bid_id == BidMessages.get_start_bid().bid_id &&bid_message.current_user==localStorage.current_user
    })){
        return true
    }
}

BidMessages.get_the_message = function (json_message){
    var phone = json_message.messages[0].phone;
    return _.find(ApplyMessages.get_apply_messages(),function(received_message){
        return received_message.phone == phone && received_message.activity_name == BidMessages.get_start_bid().activity_name && received_message.current_user ==localStorage.current_user
    })
}

BidMessages.prototype.save_bid_message = function (){
    var bid_messages=BidMessages.get_bid_messages();
    bid_messages.push(this);
    localStorage.setItem("bid_messages",JSON.stringify(bid_messages));
}

BidMessages.refresh_bid_apply_page = function(){
    var bid_apply_view_element = document.getElementById("bid_apply_page")
    if(bid_apply_view_element) {
        var scope = angular.element(bid_apply_view_element).scope()
        scope.$apply(function() {
            scope.show_bid_info()
        })
    }
}