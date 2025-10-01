<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>P₃ Lending</title>
  <style>
    body {
      background: #2d2d2d;
      color: #fff;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .logo-container {
      margin-top: 60px;
      text-align: center;
    }
    .bracket {
      font-size: 5rem;
      font-weight: 600;
      vertical-align: middle;
      display: inline-block;
      line-height: 1;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .bracket.left {
      color: #ff6f9c;
      margin-right: 10px;
    }
    .bracket.right {
      color: #2de0e6;
      margin-left: 10px;
    }
    .logo-main {
      display: inline-block;
      position: relative;
      font-size: 4rem;
      font-weight: 700;
      color: #2de0e6;
      vertical-align: middle;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .logo-main .subscript {
      position: absolute;
      right: -1.2em;
      bottom: 0.1em;
      font-size: 1.5rem;
      color: #ff9900;
      font-weight: 600;
    }
    .logo-text {
      color: #ff9900;
      font-size: 2.2rem;
      font-weight: 600;
      margin-top: 0.6em;
      letter-spacing: 0.05em;
      font-family: 'Courier New', Courier, monospace;
    }
    @media (max-width: 600px) {
      .bracket {
        font-size: 3rem;
      }
      .logo-main {
        font-size: 2.2rem;
      }
      .logo-main .subscript {
        font-size: 1rem;
        right: -0.7em;
        bottom: 0.05em;
      }
      .logo-text {
        font-size: 1.3rem;
      }
    }
  </style>
</head>
<body>
  <div class="logo-container">
    <span class="bracket left">(</span>
    <span class="logo-main">
      P
      <span class="subscript">3</span>
    </span>
    <span class="bracket right">)</span>
    <div class="logo-text">Lending</div>
  </div>
</body>
</html>
