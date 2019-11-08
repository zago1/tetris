<?php

    $nomeBanco = "";
    $host = "";
    $usuarioBanco = "";
    $senhaBanco = "";


    //Cadastra um novo usuário
    function CadastraUsuario($nome, $email, $dataNascimento, $CPF, $telefone, $usuario, $senha){
        try
        {
            if(VerificaUsuarioExiste($email, $CPF, $usuario))
                return false;   //Usuário existente
            else
            {
                //Cadastra usuário
                $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
                if($conn->query("INSERT INTO Usuario (Nome, Email, DataNascimento, CPF, Telefone, Usuario, Senha) VALUES ($nome, $email, $dataNascimento, $CPF, $telefone, $usuario, $senha)") === TRUE)
                    return true;    //Usuário cadastrado
                else
                    return false;   //Usuário não cadastrado
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
            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $result = $conn->query("SELECT COUNT(*) 'Total' FROM Usuario WHERE Email = $email OR CPF = $CPF OR Usuario = $usuario");
            $data = mysql_fetch_assoc($result);
            
            if($data['Total'] > 0)
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

            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            $stmt = $conn->query("SELECT LIMIT(10) U.Usuario, R.Pontuacao, R.Nivel, R.DataJogo FROM Resultado R INNER JOIN Usuario U ON U.Id = R.IdUsuario ORDER BY R.Pontuacao DESC");

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($ranking, array(
                    "usuario" => .$row["Usuario"], 
                    "pontuacao" => .$row["Pontuacao"],
                    "nivel" => .$row["nivel"],
                    "dataJogo" => .$row["DataJogo"]))
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
            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            if($conn->query("INSERT INTO Resultado (IdUsuario, Pontuacao, TempoJogo, DataJogo, Nivel, Tabuleiro) VALUES ($idUsuario, $pontuacao, $tempoJogo, $dataJogo, $nivel, $tabuleiro)") === TRUE)
                return true;    //Pontuação inserida
            else
                return false;   //Pontuação não inserida
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
            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            if($conn->query("UPDATE Usuario SET Nome = $nome, Telefone = $telefone WHERE Id = $idUsuario") === TRUE)
                return true;    //Dados alterados
            else
                return false;   //Dados não alterados
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
            $conn = new PDO("mysql:host=$host;dbname=$nomeBanco", $usuarioBanco, $senhaBanco);
            if($conn->query("UPDATE Usuario SET Senha = $senhaNova WHERE Id = $idUsuario AND Senha = $senhaAntiga") === TRUE)
                return true;    //Senha alterada
            else
                return false;   //Senha não alterada
        }
        catch(PDOException $e)
        {
            echo "Ocorreu um erro: " . $e->getMessage();
        }
    }

    
    // CREATE DATABASE Tetris
 
    // CREATE TABLE Resultado(
    //     `Id` int AUTO_INCREMENT NOT NULL,
    //     `IdUsuario` int NOT NULL,
    //     `Pontuacao` int NOT NULL,
    //     `TempoJogo` int NOT NULL,
    //     `DataJogo` datetime(3) NOT NULL,
    //     `Nivel` int NOT NULL,
    //     `Tabuleiro` int NOT NULL,
    // CONSTRAINT `PK_Resultado` PRIMARY KEY 
    // (`Id` ASC) );

    // CREATE TABLE Usuario(
    //     `Id` int AUTO_INCREMENT NOT NULL,
    //     `Nome` varchar(200) NOT NULL,
    //     `Email` varchar(200) NOT NULL,
    //     `DataNascimento` datetime(3) NOT NULL,
    //     `CPF` varchar(14) NOT NULL,
    //     `Telefone` varchar(11) NOT NULL,
    //     `Usuario` varchar(100) NOT NULL,
    //     `Senha` varchar(100) NOT NULL,
    // CONSTRAINT `PK_Usuario` PRIMARY KEY 
    // (`Id` ASC) );

    // ALTER TABLE `dbo`.`Resultado`  WITH CHECK ADD  CONSTRAINT `FK_Resultado_Usuario` FOREIGN KEY(`IdUsuario`)

    // REFERENCES [dbo].[Usuario] (`Id`)

    // ALTER TABLE `dbo`.`Resultado` CHECK CONSTRAINT `FK_Resultado_Usuario`
?>