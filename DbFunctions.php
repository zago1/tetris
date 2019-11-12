<?php

    $nomeBanco = "tetris";
    $host = "127.0.0.1";
    $usuarioBanco = "root";
    $senhaBanco = "ftlimeira";

    //Cadastra um novo usuário
    function CadastraUsuario($nome, $email, $dataNascimento, $CPF, $telefone, $usuario, $senha){
        try
        {
            if(VerificaUsuarioExiste($email, $CPF, $usuario))
                return false;   //Usuário existente
            else
            {
                global $host;
                global $nomeBanco;
                global $usuarioBanco;
                global $senhaBanco;
            
                //Cadastra usuário
                $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
                $conn->exec("INSERT INTO Usuario (Nome, Email, DataNascimento, CPF, Telefone, Usuario, Senha) VALUES ('$nome', '$email', '$dataNascimento', '$CPF', '$telefone', '$usuario', '$senha')");
                
                return true;
            }
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
            return false;
        }
    }

    //Verifica se um usuário existe pelo email, cpf ou username
    function VerificaUsuarioExiste($email, $CPF, $usuario){
        try
        {
            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $result = $conn->query("SELECT COUNT(*) Total FROM Usuario WHERE Email = '$email' OR CPF = '$CPF' OR Usuario = '$usuario'");
            
            $total = 0;
            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $total = $row["Total"];
            }

            if($total > 0)
                return true;
            else                
                return false;
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
            return true;
        }
    }

    //Obtém o rankin das 10 pontuações mais altas
    function ObtemRanking(){
        try
        {
            $ranking = array();

            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $stmt = $conn->query("SELECT U.Usuario, R.Pontuacao, R.Nivel, R.DataJogo FROM Resultado R INNER JOIN Usuario U ON U.Id = R.IdUsuario ORDER BY R.Pontuacao DESC LIMIT 10");

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($ranking, array(
                    "usuario" => $row["Usuario"], 
                    "pontuacao" => $row["Pontuacao"],
                    "nivel" => $row["Nivel"],
                    "dataJogo" => $row["DataJogo"]));
            }

            //Consultar exemplo em: https://www.devmedia.com.br/php-declaracao-e-atribuicao-de-arrays-em-php/38621

            return $ranking;
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    //Adiciona resultado no banco
    function AdicionaResultado($idUsuario, $pontuacao, $tempoJogo, $dataJogo, $nivel, $tabuleiro){
        try
        {
            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $conn->exec("INSERT INTO Resultado (IdUsuario, Pontuacao, TempoJogo, DataJogo, Nivel, Tabuleiro) VALUES ($idUsuario, $pontuacao, $tempoJogo, '$dataJogo', $nivel, '$tabuleiro')");
            
            return true;    //Pontuação inserida
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    //Atualiza informações do usuário
    function AtualizaInformacoesUsuario($nome, $telefone, $idUsuario){
        try
        {
            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $conn->exec("UPDATE Usuario SET Nome = '$nome', Telefone = '$telefone' WHERE Id = $idUsuario");
            
            return true;    //Dados alterados
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    //Altera a senha do usuário
    function AlteraSenha($senhaAntiga, $senhaNova, $idUsuario){
        try
        {
            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $conn->exec("UPDATE Usuario SET Senha = '$senhaNova' WHERE Id = '$idUsuario' AND Senha = '$senhaAntiga'");
            
            return true;    //Senha alterada
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    //Verifica senha para login com base no usuário
    function VerificaSenhaLogin($usuario, $senha){
        try
        {
            global $host;
            global $nomeBanco;
            global $usuarioBanco;
            global $senhaBanco;

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $stmt = $conn->query("SELECT Senha FROM `usuario` WHERE Usuario = '$usuario'");

            $senhaSalvaBanco = "";

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $senhaSalvaBanco = $row["Senha"];
            }

            if($senha == $senhaSalvaBanco)
                return true;
            else
                return false;
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    
   
    // CREATE DATABASE Tetris;
 
    // CREATE TABLE `resultado` (
    // `Id` int(11) NOT NULL,
    // `IdUsuario` int(11) NOT NULL,
    // `Pontuacao` int(11) NOT NULL,
    // `TempoJogo` int(11) NOT NULL,
    // `DataJogo` datetime NOT NULL,
    // `Nivel` int(11) NOT NULL,
    // `Tabuleiro` int(11) NOT NULL
    // ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

    // CREATE TABLE `usuario` (
    // `Id` int(11) NOT NULL,
    // `Nome` varchar(200) NOT NULL,
    // `Email` varchar(200) NOT NULL,
    // `DataNascimento` datetime NOT NULL,
    // `CPF` varchar(14) NOT NULL,
    // `Telefone` varchar(11) NOT NULL,
    // `Usuario` varchar(100) NOT NULL,
    // `Senha` varchar(100) NOT NULL
    // ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

    // ALTER TABLE `resultado`
    // ADD PRIMARY KEY (`Id`);

    // ALTER TABLE `usuario`
    // ADD PRIMARY KEY (`Id`);

    // ALTER TABLE `resultado`
    // MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

    // ALTER TABLE `usuario`
    // MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
    // COMMIT;


?>