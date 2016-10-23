
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Paint 2.0</title>
    <link rel="stylesheet" text="css\text" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="bootstrap-tour.min.js"></script>
    <link rel="stylesheet" type="text/css" href="bootstrap-tour.css">
    <script src="functions.js"></script>
    <script src="numeric-1.2.6.min.js"></script>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link href="bootstrap.icon-large.min.css" rel="stylesheet">
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <style>
    </style>
</head>
<body>
    <div id="menu">

        <div id="logo"></div>

        <div id="tools">


            <div data-toggle="buttons" class="radios">

                <label class="btn btn-sq-lg btn-primary" id="l_scale">
                    <input type="radio" id="scale" name="action" value="scale"/>Scale
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_translate">
                    <input type="radio" id="translate" name="action" value="translate"/>Translate
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_rotate">
                    <input type="radio" id="rotate" name="action" value="rotate" />Rotate
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_reflectionx">
                    <input type="radio" id="reflectionx" name="action" value="reflectionx" />Reflection X
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_reflectiony">
                    <input type="radio" id="reflectiony" name="action" value="reflectiony" />Reflection Y
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_shearx">
                    <input type="radio" id="shearx" name="action" value="shearx" />Shear X
                </label>
                <label class="btn btn-sq-lg btn-primary" id="l_sheary">
                    <input type="radio" id="sheary" name="action" value="sheary" />Shear Y
                </label>
                <div id="clearbtn">  <button class="btn btn-danger" id="clearbtn2" type="button" onclick="clearCanvas()">Clear</button></div>
                <div id="load_file">  <button class="btn btn-warning" id="load_file2" type="button" onclick="loadFile()">Load File</button></div>

            </div>
        </div>
    </div>

<canvas id="canvas" width="500" height="500"></canvas>

    <?php
    $filename = "boat.txt";
    $lineArray = array();
    $circleArray = array();
    $curveArray = array();
    $lineIterator = 0;
    $circleIterator = 0;
    $curveIterator = 0;

    $lines = file($filename);   //read from file to array

    //search for shapes
    foreach ($lines as $line_num => $line) {
         if(preg_match('/LINE/', $lines[$line_num])){  //look for lines
             $points = explode("-", $lines[$line_num]);
             $lineArray[$lineIterator] = $points[1];
             $lineIterator++;
         }

        else if(preg_match('/CIRCLE/', $lines[$line_num])){  //look for circle
            $points = explode("-", $lines[$line_num]);
            $circleArray[$circleIterator] = $points[1];
            $circleIterator++;
        }
        else if(preg_match('/CURVE/', $lines[$line_num])){  //look for curve
            $points= explode("-", $lines[$line_num]);
            $curveArray[$curveIterator] = $points[1];
            $curveIterator++;
        }
    }
    ?>

    <script type="text/javascript">
        //global arrays of shapes
        var tempLineArray = <?php echo json_encode($lineArray) ?>;
        var tempCircleArray = <?php echo json_encode($circleArray) ?>;
        var tempCurveArray = <?php echo json_encode($curveArray) ?>;

    </script>
</body>
</html>