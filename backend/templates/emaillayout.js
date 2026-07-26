const emailLayout = (title, content) => `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8"/>

<style>

body{
    margin:0;
    padding:30px;
    background:#F6F2EC;
    font-family:Arial,sans-serif;
}

.wrapper{
    max-width:700px;
    margin:auto;
    background:white;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 12px 40px rgba(0,0,0,.08);
}

.header{
    background:#4A3F35;
    color:white;
    text-align:center;
    padding:35px;
}

.logo{
    font-size:34px;
    font-weight:bold;
    letter-spacing:2px;
}

.tagline{
    margin-top:8px;
    color:#D8C5A5;
}

.content{
    padding:40px;
    color:#444;
    line-height:1.8;
}

.button{
    display:inline-block;
    padding:12px 28px;
    background:#B8893A;
    color:white !important;
    text-decoration:none;
    border-radius:8px;
    margin-top:20px;
}

.footer{
    background:#F8F5F0;
    padding:25px;
    text-align:center;
    color:#888;
    font-size:13px;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

td{
    padding:12px;
    border-bottom:1px solid #eee;
}

</style>

</head>

<body>

<div class="wrapper">

<div class="header">

<div class="logo">
Trendora Boutique
</div>

<div class="tagline">
Premium Tailoring & Fashion
</div>

</div>

<div class="content">

<h2>${title}</h2>

${content}

</div>

<div class="footer">

Thank you for choosing
<strong>Trendora Boutique ❤️</strong>

<br><br>

This is an automated email.
Please do not reply.

</div>

</div>

</body>

</html>
`;

export default emailLayout;