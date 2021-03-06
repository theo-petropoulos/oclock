window.h=window.m=window.s=0;
window.currClock='clock';
window.currTimerInput=window.currAlarmInput='';
window.counter='';
window.chrono='';
window.alarm='';
window.timer_seconds=window.timer_minutes=window.timer_hours=0;
window.alarm_seconds=window.alarm_minutes=window.alarm_hours=0;
window.timer_array=[];
window.alarm_array=[];
window.prevent='none';

//Send exact height for responsive purpose
$(window).on('load', function(){
    $('#clock_widget').css({
        "height":$('#clock_body').css('height')
    });
    $(window).on('resize', function(){
        $('#clock_widget').css({
            "height":$('#clock_body').css('height')
        });
    });
    
});

$(function() {
    //Audio on click
    const light_click=new Audio('assets/sounds/light_click.mp3');
    const click=new Audio('assets/sounds/click.mp3');

    //Display time
    clock();
    setInterval(clock, 1000);

    //Used to scale map / areas
    $('map').imageMapResize();

    //Prevent new tab
    $('area').on('click', function(e){
        e.preventDefault();
    });

    //Do not show pointer on non-clickable elements
    $('.clock_screen').on('mouseenter', function(){
        $(this).css('cursor','initial');
    });

    $(document).on('click', '.alarm_ps', function(){
        let id=$(this).attr('id').replace('alarm_p','');
        if($(this).find('span').length < 1){
            $(this).append('<span id="alarm_span_'+id+'">' + alarm_array[id-1].message + '</span>')
            $(this).append('<button id="alarm_button_'+id+'" class="alarm_button"><i class="fas fa-times"></i></button>')
            $("#alarm_span_" + id).animate({
                right:"105%",
                opacity:"1"
            })
            $("#alarm_button_" + id).animate({
                right:"-15%",
                opacity:"1"
            })
        }
        else{
            $("#alarm_span_" + id).add($("#alarm_button_" + id)).animate({
                right:"50%",
                opacity:"0"
            })
            setTimeout(() => {
                $("#alarm_span_" + id).add($("#alarm_button_" + id)).remove()
            }, 200);
        }
    })

    $(document).on('click', '.alarm_button', function(){
        let id=$(this).attr('id').replace('alarm_button_','');
        $("#alarm_p" + id).remove()
        alarm_array.splice(id-1, 1)
        if( $("#alarm_p" + (+id - 1)).length ){
            $('.alarm_ps').each(function(){
                if($(this).attr('id').replace('alarm_p','') > id){
                    clog('if')
                    return 1;
                }
                $(this).animate({
                    top:"-=2vw",
                    right:"-=2vw"
                })
            })
        }
        if( $("#alarm_p" + (+id + 1)).length ){
            while( $("#alarm_p" + (+id + 1)).length ){
                $("#alarm_p" + (+ id + 1)).attr('id', "alarm_p" + id)
                id++;
            }
        }
    })

    //Functions depending on user's actions
    $('area').not('.clock_screen').on({
        'mouseenter':function(e){
            if($(e.target).is(':hover')){
                $('#' + $(this).attr('title')).css({
                    "animation":"wiggle 0.5s 0s linear infinite"
                });
            }
        }, 

        'mouseleave':function(){
            $('#' + $(this).attr('title')).css({
                "animation":"none"
            });
        },

        'click':function(e){
            e.preventDefault();
            $(currTimerInput).add($("#message")).add($(currAlarmInput)).css('animation', 'none');
            $("#message").css('width', 'initial');

            $('#' + $(this).attr('title')).css({
                "animation":"none",
                "transition":"all 0.3s",
            });
            //If the button is a menu button
            if(!$(this).hasClass('diff_transform')){
                //Play sound
                click.currentTime=0;
                click.play();

                //Animation
                $('#' + $(this).attr('title')).css({
                    "transform":"translate(1%, -1%)"
                });

                //Used to reset an item
                let tempClock=currClock;
                //Used to define current mode
                currClock=$(this).attr('title').replace('button_','');
                //Reset the timer if the timer is paused & is already on timer mode
                if(counter=='paused' && currClock=='timer' && tempClock=='timer'){
                    timer_seconds=timer_minutes=timer_hours=0;
                    currTimerInput='';
                }
                //Reset the chrono and empty stored timestamps
                if(chrono=='paused' && currClock=='chrono' && tempClock=='chrono'){
                    prevent='empty_chrono';
                    $(timer_array).each(function(index, value){
                        setTimeout(() => {
                            $("#p" + index).css("animation", "disappear 0.8s ease forwards");
                            if((index + 1)==timer_array.length) setTimeout(() => {
                                $("#dynamic_text").empty();
                                timer_array=[];
                            }, 200);
                        }, index*90);
                    });
                    chrono='';
                    chrono_seconds=chrono_minutes=chrono_hours='00';
                }
                //Hide stored timestamps if current mode isn't chrono
                if(timer_array.length>0 && currClock!=='chrono'){
                    $(timer_array).each(function(index, value){
                        setTimeout(() => {
                            $("#p" + index).css("animation", "fade_out 0.7s ease forwards");
                        }, index*70);
                    });
                }
                //Hide alarms if current mode isn't alarm
                if(currClock!=='alarm' && alarm_array.length>0 && tempClock=='alarm'){
                    $('.alarm_ps').each(function(){
                        $(this).animate({
                            top:'0',
                            right:'0'
                        });
                    });
                    $('#alarm_text').css("z-index", "initial")
                } else if(currClock=='alarm' && alarm_array.length>0){
                    $('.alarm_ps').each(function(index){
                        index+=1;
                        $(this).animate({
                            top:2*index + 'vw',
                            right: 2*index + 'vw'
                        });
                    });
                    setTimeout(() => {
                        $('#alarm_text').css("z-index", "3")
                    }, 300);
                }
            }
            //If the button is a nav button
            else{
                //Play sound
                light_click.currentTime=0;
                light_click.play();

                //Animation
                $('#' + $(this).attr('title')).css({
                    "transform":"translate(1%, -0.5%)"
                });
            }
            setTimeout(() => {
                $('#' + $(this).attr('title')).css({
                    "transform":"translate(0%, 0%)"
                });
                setTimeout(() => {
                    $(this).trigger('mouseleave');
                    $(this).trigger('mouseenter');
                }, 200);
            }, 240);
                // End Animation

            //Change text based on click
            switch($(this).attr('title')){
                case 'button_clock':
                    changeName('une horloge');
                    break;
                case 'button_timer':
                    changeName('un minuteur');
                    break;
                case 'button_chrono':
                    changeName('un chronom??tre');
                    break;
                case 'button_alarm':
                    changeName('un r??veil');
                    break;
                default:break;
            }

            //Call function named after the title
            window[$(this).attr('title')]();
        }
    });

    //For chrome & other
    $(document).on('keydown', function(e){
        if(e.which=='13'){
            e.preventDefault();
            $("area[title|='button_circle']").trigger('click');
        }
        if(e.which=='46' || e.which=='8'){
            if(
            ($(currAlarmInput).attr('id')==$("#message").attr('id') ||
            $(currAlarmInput).attr('id')==$("#hours").attr('id') ||
            $(currAlarmInput).attr('id')==$("#minutes").attr('id') ||
            $(currAlarmInput).attr('id')==$("#seconds").attr('id') ) &&
            $(currAlarmInput).html().length>0){
                $(currAlarmInput).html($(currAlarmInput).html().replace('_','').slice(0,-1));
                $(currAlarmInput).append('_');
            }
        }
    });

    //User's keyboard input 
    $(document).on('keypress', function(e){
        e.preventDefault();
        if(currClock=='timer' && currTimerInput !==1 && currTimerInput !==''){
            sendKeyPress(e.which, currTimerInput);
        }
        else if(currClock=='alarm' && currAlarmInput !==1 && currAlarmInput !==''){
            sendKeyPress(e.which, currAlarmInput);
        }
    });
});

function clog(x){
    return console.log(x);
}

function button_clock(){
    currTimerInput=currAlarmInput='';
    $("#title").html('Horloge');
    clock();
    if(alarm_array.length<1 || get_min_time(alarm_array)==0) $("#message").html('Aucune alarme programm??e');
    else $("#message").html("Prochaine alarme : " + get_min_time(alarm_array));
    check_width($("#message"));
}

function button_timer(){
    currAlarmInput='';
    $("#title").html('Minuteur');
    if(timer_seconds==0 && timer_minutes==0 && timer_hours==0){
        $("#message").html('Choisir la dur??e');
        if(currTimerInput==''){
            currTimerInput=$('#hours');
            $('#hours').add($('#minutes')).add($('#seconds')).html('00');
        }
        $(currTimerInput).css('animation','wink 0.8s 0s linear infinite alternate-reverse');
    }
    else{
        $("#hours").html(timer_hours); $("#minutes").html(timer_minutes); $("#seconds").html(timer_seconds);
        $("#message").html('<i class="far fa-circle"></i> Marche / Arr??t | <i class="far fa-circle"></i> + <i class="far fa-square"></i> R??initialiser');
    }
    check_width($("#message"));
}

function button_chrono(){
    currTimerInput=currAlarmInput='';
    $("#title").html('Chronom??tre');
    $("#message").html('<i class="fas fa-caret-left"></i> Enregistrer le temps | <i class="far fa-circle"></i> Marche / Arr??t | <i class="fas fa-caret-right"></i> Afficher les temps');
    if(timer_array.length>0 && prevent!=='empty_chrono'){
        $(timer_array).each(function(index, value){
            setTimeout(() => {
                $("#p" + index).css("animation", "slide_to_right 0.9s ease forwards");
            }, index*120);
        });
    }
    prevent='none';
    if(chrono!=='start' && chrono!=='paused'){
        $('#hours').add($('#minutes')).add($('#seconds')).html('00');
    }
    else if(chrono=='start' || chrono=='paused'){
        $('#hours').html(chrono_hours); $('#minutes').html(chrono_minutes); $('#seconds').html(chrono_seconds);
    }
    check_width($("#message"));
}

function button_alarm(){
    currTimerInput='';
    $("#title").html('R??veil');
    if(alarm_seconds==0 && alarm_minutes==0 && alarm_hours==0 && alarm!=='set' && $(currAlarmInput).attr('id')!==$("#message").attr('id')){
        $("#message").html('Choisir l\'heure');
        if(currAlarmInput==''){
            currAlarmInput=$('#hours');
            $('#hours').add($('#minutes')).add($('#seconds')).html('00');
        }
        $(currAlarmInput).css('animation','wink 0.8s 0s linear infinite alternate-reverse');
    }
    else if(alarm=='set'){
        alarm='';
        $("#alarm_text").prepend("<p class='alarm_ps' id='alarm_p" + alarm_array.length + "'>" + alarm_hours + ":" + alarm_minutes + ":" + alarm_seconds + "</p>");
        if(alarm_hours==h && alarm_minutes==m) $("#alarm_p" + alarm_array.length).addClass('done');
        $(".alarm_ps").each(function(){
            $(this).animate({
                top: '+=2vw',
                right: '+=2vw'
            });
        });
        $("#alarm_p" + alarm_array.length).css({
            "animation":"fade_in 0.6s ease forwards"
        });
        alarm_seconds=alarm_minutes=alarm_hours=0;
        currAlarmInput=$('#hours');
        $('#hours').add($('#minutes')).add($('#seconds')).html('00');
        $(currAlarmInput).css('animation','wink 0.8s 0s linear infinite alternate-reverse');
        $("#message").html('Alarme enregistr??e'); 
    }
}

function button_circle(){
    switch(currClock){
        case 'clock':

            break;
        case 'timer':
            if($(currTimerInput).attr('id')==$('#hours').attr('id')){
                if($('#hours').html().length==1) $('#hours').prepend('0');
                currTimerInput=$('#minutes');
            }
            else if($(currTimerInput).attr('id')==$('#minutes').attr('id')){
                if($('#minutes').html().length==1) $('#minutes').prepend('0');
                currTimerInput=$('#seconds');
            }
            else if($(currTimerInput).attr('id')==$('#seconds').attr('id')){
                $("#message").html('C\'est parti !');
                timer_seconds=$('#seconds').html();
                timer_minutes=$('#minutes').html();
                timer_hours=$('#hours').html();
                counter='start';
                countdown();
                timer_interval=setInterval(countdown, 1000);
                currTimerInput=1
            }
            else if(counter=='start'){
                counter='paused';
                clearInterval(timer_interval);
            }
            else if(counter=='paused'){
                timer_interval=setInterval(countdown, 1000);
                counter='start';
            }
            button_timer();
            break;
        case 'chrono':
            if(chrono=='paused'){
                chrono_interval=setInterval(chrono_start, 1000);
                chrono='start';
            }
            else if(chrono!=='start'){
                chrono_seconds=$('#seconds').html();
                chrono_minutes=$('#minutes').html();
                chrono_hours=$('#hours').html();
                chrono='start';
                chrono_start();
                chrono_interval=setInterval(chrono_start, 1000);
            }
            else if(chrono=='start'){
                chrono='paused';
                clearInterval(chrono_interval);
            }
            break;
        case 'alarm':
            if($(currAlarmInput).attr('id')==$('#hours').attr('id')){
                if($('#hours').html().length==1) $('#hours').prepend('0');
                currAlarmInput=$('#minutes');
            }
            else if($(currAlarmInput).attr('id')==$('#minutes').attr('id')){
                if($('#minutes').html().length==1) $('#minutes').prepend('0');
                $("#message").html("_");
                $("#message").css("animation","wink 0.8s 0s linear infinite alternate-reverse");
                currAlarmInput=$('#message');
                $('#seconds').html('00');
                alarm_seconds=$('#seconds').html();
                alarm_minutes=$('#minutes').html();
                alarm_hours=$('#hours').html();
            }
            else if($(currAlarmInput).attr('id')==$("#message").attr('id')){
                message=$("#message").html().replace('_','');
                let alarm_object={
                    'seconds' : alarm_seconds,
                    'minutes' : alarm_minutes,
                    'hours' : alarm_hours,
                    'message' : message,
                    'status' : 'upcoming'
                }
                alarm='set';
                alarm_array.push(alarm_object);
                check_alarm();
            }
            button_alarm();
            break;
        default:break;
    }
    check_width($("#message"));
}

function button_left(){
    button_arrow('left');
}

function button_right(){
    button_arrow('right');
}

function button_arrow(dir){
    switch(currClock){
        case 'clock':

            break;
        case 'timer':
            if(counter!=='start' && counter!=='paused') masomenos1($(currTimerInput), dir);
            button_timer();
            break;
        case 'chrono':
            if(chrono=='start' || chrono=='paused'){
                if(dir=='left'){
                    if(timer_array.length>6) $("#message").html("La m??moire est pleine.");
                    else timer_array.push(chrono_hours + ':' + chrono_minutes + ':' + chrono_seconds);
                }
                else if(dir=='right'){
                    $("#dynamic_text").empty();
                    $(timer_array).each(function(index, value){
                        setTimeout(() => {
                            $("#dynamic_text").append('<p id="p' + index + '">' + value + '</p>');
                        }, index*120);
                    });
                }
            }
            break;
        case 'alarm':
            if($(currAlarmInput).attr('id')!==$("#message").attr('id')) masomenos1($(currAlarmInput), dir);
            break;
        default:break;
    }
    check_width($("#message"));
}

function clock(){
    var date=new Date();
    h=date.getHours();
    if(h<10) h='0' + h;

    m=date.getMinutes();
    if(m<10) m= '0' + m;

    s=date.getSeconds();
    if(s<10) s= '0' + s;

    if(currClock=='clock'){
        $("#hours").html(h);
        $("#minutes").html(m);
        $("#seconds").html(s);
    }
}

function countdown(){
    if(counter=='finished') return 0;
    else if(counter=='start'){
        timer_seconds--;
        if(timer_seconds<10 && timer_seconds>=0) timer_seconds = '0' + timer_seconds;

        if(parseInt(timer_seconds)<0){
            if( parseInt(timer_minutes)>0 || parseInt(timer_hours)>0 ){
                timer_seconds=59;
                timer_minutes--;
                if(timer_minutes<10 && timer_minutes>=0) timer_minutes = '0' + timer_minutes;
                
                if(timer_minutes<0 && timer_hours>0){
                    timer_minutes=59;
                    timer_hours--;
                    if(timer_hours<10 && timer_hours>=0) timer_hours='0' + timer_hours;
                }
            } else{
                timer_seconds=timer_minutes=timer_hours='00';
                $('#message').html('Le temps est ??coul?? !')
                counter='finished';
                currTimerInput='';
                clearInterval(timer_interval);
            }
        }
        if(currClock=='timer'){
            $('#seconds').html(timer_seconds);
            $('#minutes').html(timer_minutes);
            $('#hours').html(timer_hours);
        }
    }
}

function chrono_start(){
    chrono_seconds++;
    if(chrono_seconds<10 && chrono_seconds>=0) chrono_seconds= '0' + chrono_seconds;
    if(chrono_seconds>59){
        chrono_seconds='00';
        chrono_minutes++;
        if(chrono_minutes<10 && chrono_minutes>=0) chrono_minutes= '0' + chrono_minutes;
        if(chrono_minutes>59){
            chrono_minutes='00';
            chrono_hours++;
            if(chrono_hours<10 && chrono_hours>=0) chrono_hours= '0' + chrono_hours;
            if(chrono_hours>23){
                chrono_hours='00';
            }
        }
    }
    if(currClock=='chrono'){
        $('#seconds').html(chrono_seconds);
        $('#minutes').html(chrono_minutes);
        $('#hours').html(chrono_hours);
    }
}

function changeName(name){
    $('*').css({
        "pointer-events":"none"
    });
    setTimeout(() => {
        $('*').css({
            "pointer-events":"initial"
        });
    }, 1000);
    if($('#text_one').html()!==name){
        $("#text_twins").append('<p id="text_new">' + name + '</p>');
        $("#text_new").css({
            "position":"absolute",
            "top":"0",
            "left":"0",
            "animation":"godown 1s 0s ease forwards",
            "width":"max-content",
            "color":"rgb(97, 97, 97)"
        });
        $("#text_one").css({
            "animation":"goout 1s 0s ease forwards"
        })
        setTimeout(() => {
            $("#text_one").remove();
            $("#text_new").prop('id', 'text_one');
        }, 1000);
    }
}

function sendKeyPress(key, tag){
    let input=String.fromCharCode(key);
    if($(currAlarmInput).attr('id')!==$("#message").attr('id')){
        if($.isNumeric(input)){
            if($(tag).html().length==2 || $(tag).html().length<1) $(tag).html(input);
            else if($(tag).html().length==1){
                $(tag).append(input);
                if($(tag).is('#hours') && $(tag).html()>23) $(tag).html('23');
                else if($(tag).html()>59) $(tag).html('59');
            }
        }
        else if(key=='13'){
            $("area[title|='button_circle']").trigger('click');
        }
    }
    else if($(currAlarmInput).attr('id')==$("#message").attr('id')){
        if(input.match("^[a-z A-Z0-9?????????????????!@.,\(\)]+$")){
            $("#message").html($("#message").html().replace('_',''));
            if($(tag).html().length<30) $(tag).append(input + '_');
            else if($(tag).html().length==30) $("#message").html($("#message").html().replace('_',''));
        }
        else if(key=='13'){
            $("area[title|='button_circle']").trigger('click');
        }
    }
    return 0;
}

function check_width(text){
    if(text.html().length > 40){
        text.css({
            "width":"max-content",
            "animation":"slide_to_left 18s 0s steps(70,end) infinite"
        });
    }
    return 0;
}

function check_alarm(){
    if(alarm_array.length>0){
        $(alarm_array).each(function(index, value){
            if(value['status']=='upcoming'){
                if(value['hours']==h){
                    if(value['minutes']==m){
                        $("#dring_text").html("<p>" + value['message'] + "</p>");
                        $("#dring_text p").animate({
                            right:"+=11vw"
                        });
                        setTimeout(() => {
                            $("#dring_text p").css("animation", "disappear 0.8s 0s ease forwards");
                            setTimeout(() => {
                                $("#dring_text").empty();
                            }, 6000);
                        }, 30000);
                        value['status']='done';
                        $("#alarm_p" + (index+1)).addClass('done');
                        $("#message").html(value['message']);
                    }
                }
            }
        });
        setTimeout(check_alarm, 1000);
    }
}

function get_min_time(array){
    var temp,distance,distance2;
    $(array).each(function(index, value){
        if(value['status']=='upcoming'){
            let strvalue=value['hours'] + ":" + value['minutes'] + ":00";
            let strtime=h + ":" + m + ":00";
            if(temp===undefined) temp=strvalue;
            if(strvalue > strtime && (strvalue < temp || temp < strtime) ) temp=strvalue;
            else if(strvalue < temp && strvalue < strtime && temp < strtime) temp=strvalue;
        }
    });
    if(temp!==undefined) return temp;
    else return 0;
}

function masomenos1(input, dir){
    if(dir=='left'){
        input.html(parseInt(input.html())-1);
        if(input.attr('id')=='hours' && input.html()<0) input.html(23);
        if(input.html()<10 && input.html()>=0) input.html("0" + input.html());
        if(input.html()<0) input.html(59);
    }
    else if(dir=='right'){
        input.html(parseInt(input.html())+1);
        if(input.html()<10 && input.html()>=0) input.html("0" + input.html());
        if(input.attr('id')=='hours' && input.html()>23) input.html("00");
        if(input.html()>59) input.html("00");
    }
}