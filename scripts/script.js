window.currClock='clock';
window.currTimerInput='';
window.counter='';

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
            $(currTimerInput).css('animation', 'none');
            // ANIMATION //
            $('#' + $(this).attr('title')).css({
                "animation":"none",
                "transition":"all 0.3s",
            });
            if(!$(this).hasClass('diff_transform')){
                $('#' + $(this).attr('title')).css({
                    "transform":"translate(1%, -1%)"
                });
            }
            else{
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
            // END ANIMATION //
            
            window[$(this).attr('title')]();
        }
    });
});

function clog(x){
    return console.log(x);
}

function button_clock(){
    currClock='clock';
    counter='';
    currTimerInput='';
    $("#title").html('Horloge');
    clock();
    setInterval(clock, 1000);
}

function button_timer(){
    currClock='timer';
    counter='';
    $("#title").html('Minuteur');
    $("#message").html('Choisir la durée');
    if(currTimerInput==''){
        currTimerInput=$('#hours');
        $('#hours').add($('#minutes')).add($('#seconds')).html('00');
    }
    $(currTimerInput).css('animation','wink 0.8s 0s linear infinite alternate-reverse');
}

function button_chrono(){
    currClock='chrono';
    $("#title").html('Chronomètre');
}

function button_alarm(){
    currClock='alarm';
    $("#title").html('Réveil');
}

function button_circle(){
    switch(currClock){
        case 'clock':

            break;
        case 'timer':
            if($(currTimerInput).attr('id')==$('#hours').attr('id')) currTimerInput=$('#minutes');
            else if($(currTimerInput).attr('id')==$('#minutes').attr('id')) currTimerInput=$('#seconds');
            else if($(currTimerInput).attr('id')==$('#seconds').attr('id')){
                $("#message").html('C\'est parti !');
                countdown();
                timer_interval=setInterval(countdown, 1000);
                currTimerInput=1
            }
            else if(currTimerInput==1) currTimerInput='';
            button_timer();
            break;
        case 'chrono':

            break;
        case 'alarm':

            break;
        default:break;
    }
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
            if(dir=='left'){
                currTimerInput.html(parseInt(currTimerInput.html())-1);
                if($(currTimerInput).attr('id')=='hours' && currTimerInput.html()<0) currTimerInput.html(23);
                if(currTimerInput.html()<10 && currTimerInput.html()>=0) currTimerInput.html("0" + currTimerInput.html());
                if(currTimerInput.html()<0) currTimerInput.html(59);
            }
            else if(dir=='right'){
                currTimerInput.html(parseInt(currTimerInput.html())+1);
                if(currTimerInput.html()<10 && currTimerInput.html()>=0) currTimerInput.html("0" + currTimerInput.html());
                if($(currTimerInput).attr('id')=='hours' && currTimerInput.html()>23) currTimerInput.html("00");
                if(currTimerInput.html()>59) currTimerInput.html("00");
            }
            break;
        case 'chrono':
            
            break;
        case 'alarm':
        
            break;
        default:break;
    }
    button_timer();
}

function clock(){
    if(currClock!=='clock') return 0;
    var date=new Date();
    var h=date.getHours();
    if(h<10) h='0' + h;

    var m=date.getMinutes();
    if(m<10) m= '0' + m;

    var s=date.getSeconds();
    if(s<10) s= '0' + s;

    $("#hours").html(h);
    $("#minutes").html(m);
    $("#seconds").html(s);
}

function countdown(){
    if(counter=='finished') return 0;
    $('#seconds').html($('#seconds').html() - 1);
    if($('#seconds').html()<10 && $('#seconds').html()>=0) $('#seconds').prepend('0');

    if(parseInt($('#seconds').html())<0){
        if( parseInt($('#minutes').html())>0 || parseInt($('#hours').html())>0 ){
            $('#seconds').html(59);
            $('#minutes').html($('#minutes').html() -1);
            if($('#minutes').html()<10 && $('#minutes').html()>=0) $('#minutes').prepend('0');
            
            if($('#minutes').html()<0 && $('#hours').html()>0){
                $('#minutes').html(59);
                $('#hours').html($('#hours').html() - 1);
                if($('#hours').html()<10 && $('#hours').html()>=0) $('#hours').prepend('0');
                // if($('#hours').html()<0){
                //     console.log('finished');
                //     $('#hours').add($('#minutes')).add($('#seconds')).html('00');
                //     counter='finished';
                // }
            }
        } else{
            $('#hours').add($('#minutes')).add($('#seconds')).html('00');
            $('#message').html('Minuteur terminé !')
            counter='finished';
            clearInterval(timer_interval);
        }
    }
}