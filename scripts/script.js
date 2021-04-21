window.currClock='clock';
window.currTimerInput='';
window.counter='';
window.timer_hours=0;
window.timer_minutes=0;
window.timer_seconds=0;

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
            $(currTimerInput).add($("#message")).css('animation', 'none');
            $("#message").css('width', 'initial');    

            // ANIMATION //
            $('#' + $(this).attr('title')).css({
                "animation":"none",
                "transition":"all 0.3s",
            });
            if(!$(this).hasClass('diff_transform')){
                click.currentTime=0;
                click.play();
                $('#' + $(this).attr('title')).css({
                    "transform":"translate(1%, -1%)"
                });

                let tempClock=currClock;      
                currClock=$(this).attr('title').replace('button_','');
                if(counter=='paused' && currClock=='timer' && tempClock=='timer'){
                    timer_seconds=timer_minutes=timer_hours=0;
                    currTimerInput='';
                }
                
            }
            else{
                light_click.currentTime=0;
                light_click.play();
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

            switch($(this).attr('title')){
                case 'button_clock':
                    changeName('une horloge');
                    break;
                case 'button_timer':
                    changeName('un minuteur');
                    break;
                case 'button_chrono':
                    changeName('un chronomètre');
                    break;
                case 'button_alarm':
                    changeName('un réveil');
                    break;
                default:break;
            }
            // END ANIMATION //

            window[$(this).attr('title')]();
        }
    });

    //User' keyboard input 
    $(document).on('keypress', function(e){
        e.preventDefault();
        if(currClock=='timer' && currTimerInput !==1 && currTimerInput !==''){
            let input=String.fromCharCode(e.which);
            if($.isNumeric(input)){
                if(currTimerInput.html().length==2 || $(currTimerInput).html().length<1) $(currTimerInput).html(input);
                else if($(currTimerInput).html().length==1){
                    $(currTimerInput).append(input);
                    if($(currTimerInput).is('#hours') && $(currTimerInput).html()>23) $(currTimerInput).html('23');
                    else if($(currTimerInput).html()>59) $(currTimerInput).html('59');
                }
            }
            else if(e.which=='13'){
                $("area[title|='button_circle']").trigger('click');
            }
        }
    });
});

function clog(x){
    return console.log(x);
}

function button_clock(){
    currTimerInput='';
    $("#title").html('Horloge');
    $("#message").html('Aucun réveil programmé');
    clock();
    setInterval(clock, 1000);
}

function button_timer(){
    $("#title").html('Minuteur');
    if(timer_seconds==0 && timer_minutes==0 && timer_hours==0){
        $("#message").html('Choisir la durée');
        if(currTimerInput==''){
            currTimerInput=$('#hours');
            $('#hours').add($('#minutes')).add($('#seconds')).html('00');
        }
        $(currTimerInput).css('animation','wink 0.8s 0s linear infinite alternate-reverse');
    }
    else{
        $("#hours").html(timer_hours); $("#minutes").html(timer_minutes); $("#seconds").html(timer_seconds);
        $("#message").html('Tic tac tic tac');
    }
}

function button_chrono(){
    $("#title").html('Chronomètre');
    $("#message").html('Flèche gauche -> Enregistrer le temps | Bouton central -> Marche / Arrêt | Flèche droite -> Afficher les temps');
    $('#hours').add($('#minutes')).add($('#seconds')).html('00');
    check_width($("#message"));
}

function button_alarm(){
    $("#title").html('Réveil');
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
            chrono_start();
            chrono_interval=setInterval(countdown, 1000);
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
            if(counter!=='start'){
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
            }
            button_timer();
            break;
        case 'chrono':
            
            break;
        case 'alarm':
        
            break;
        default:break;
    }
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
                    if(hours<10 && hours>=0) timer_hours='0' + timer_hours;
                }
            } else{
                timer_seconds=timer_minutes=timer_hours='00';
                $('#message').html('Le temps est écoulé !')
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

function check_width(text){
    if(text.prop('scrollWidth') > text.height()){
        text.css({
            "width":"max-content",
            "animation":"slide_to_left 18s 0s steps(70,end) infinite"
        });
    }
}