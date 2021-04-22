<?php

?>

<!DOCTYPE html>

<html prefix="og: https://ogp.me/ns#" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/clock.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Trispace:wght@200&display=swap" rel="stylesheet"> 
    <link href="https://fonts.googleapis.com/css2?family=Orelega+One&display=swap" rel="stylesheet"> 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://kit.fontawesome.com/9ddb75d515.js" crossorigin="anonymous"></script>
    <script src="node_modules\image-map-resizer\js\imageMapResizer.min.js"></script>
    <script src="scripts/script.js"></script>
    <title>Clock</title>
</head>

<body>
    <div id="block_screen">
        <img src="assets/images/rotatedevice.gif">
    </div>
    <section id="giant_text">
        <p class="giant">Ceci est</p>
        <p id="text_twins">
            <span id="text_one">une horloge</span>
        </p>
    </section>
    <section id="dynamic_text">
    </section>
    <section id="clock_widget">
        <div id="clock_display">
            <p id="breaker"></p>
            <p id="time"><span id="hours">14</span>:<span id="minutes">58</span><small id="seconds">27</small></p>
            <p id="title">Horloge</p>
            <p id="message">Aucun réveil programmé</p>
        </div>
        <section id="alarm_text"></section>
        <section id="dring_text"></section>
        <img id="button_clock" src="assets/images/button_1.png" usemap="#image-map">
        <img id="button_timer" src="assets/images/button_2.png" usemap="#image-map">
        <img id="button_chrono" src="assets/images/button_3.png" usemap="#image-map">
        <img id="button_alarm" src="assets/images/button_4.png" usemap="#image-map">
        <img id="button_left" src="assets/images/arrow_left.png" usemap="#image-map">
        <img id="button_circle" src="assets/images/button_circle.png" usemap="#image-map">
        <img id="button_right" src="assets/images/arrow_right.png" usemap="#image-map">
        <img id="clock_body" src="assets/images/clock_body.png" usemap="#image-map">
        <img id="clock_screen" src="assets/images/clock_screen.png" usemap="#image-map">
        <map id="clock_map" name="image-map">
            <area target="_blank" alt="button_clock" title="button_clock" href="" coords="234,476,252,467,288,476,290,538,276,546,231,540" shape="poly">
            <area target="_blank" alt="button_timer" title="button_timer" href="" coords="355,485,331,494,331,557,374,564,389,555,389,495" shape="poly">
            <area target="_blank" alt="button_chrono" title="button_chrono" href="" coords="455,503,434,511,432,574,476,582,491,572,489,512" shape="poly">
            <area target="_blank" alt="button_alarm" title="button_alarm" href="" coords="557,517,535,527,533,591,576,598,592,590,590,527" shape="poly">
            <area target="_blank" class="diff_transform" alt="button_left" title="button_left" href="" coords="670,585,713,567,720,567,718,599,705,605" shape="poly">
            <area target="_blank" class="diff_transform" alt="button_right" title="button_right" href="" coords="838,590,852,588,892,615,887,621,838,626" shape="poly">
            <area target="_blank" class="diff_transform" alt="button_circle" title="button_circle" href="" coords="777,593,39" shape="circle">
            <area target="_blank" class="clock_screen" alt="clock_screen" title="clock_screen" href="" coords="265,249,265,404,584,455,587,303" shape="poly">
        </map>
    </section>
</body>

</html>