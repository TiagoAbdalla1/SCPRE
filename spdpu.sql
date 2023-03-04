-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 22-Jul-2019 às 04:26
-- Versão do servidor: 5.7.23
-- versão do PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spdpu`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `cargo`
--

DROP TABLE IF EXISTS `cargo`;
CREATE TABLE IF NOT EXISTS `cargo` (
  `cod` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT 'Código do cargo',
  `nome` varchar(100) NOT NULL COMMENT 'Nome do cargo',
  `carga_horaria` tinyint(4) NOT NULL COMMENT 'Carga horária referente ao cargo',
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `cargo`
--

INSERT INTO `cargo` (`cod`, `nome`, `carga_horaria`) VALUES
(1, 'Estagiário', 4),
(2, 'Servidor', 8),
(3, 'Terceirizado', 8),
(4, 'Jornalista', 5),
(5, 'Motorista', 8);

-- --------------------------------------------------------

--
-- Estrutura da tabela `justificativa`
--

DROP TABLE IF EXISTS `justificativa`;
CREATE TABLE IF NOT EXISTS `justificativa` (
  `cod` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT 'Código da justificativa',
  `descricao` varchar(100) NOT NULL COMMENT 'Descrição da justificativa',
  `permite_horario` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `justificativa`
--

INSERT INTO `justificativa` (`cod`, `descricao`, `permite_horario`) VALUES
(1, 'Abono', 0),
(2, 'A disp. justiça eleitoral', 0),
(3, 'Atestado médico', 0),
(4, 'Ausência justificada', 0),
(5, 'Casamento', 0),
(6, 'Consulta médica', 0),
(7, 'Doação de sangue', 0),
(8, 'Esqueceu de registrar o ponto', 1),
(9, 'Falecimento de familiar', 0),
(10, 'Férias', 0),
(11, 'Folga plantão', 0),
(12, 'Licença gestante', 0),
(13, 'Licença para capacitação', 0),
(14, 'Licença paternidade', 0),
(15, 'Licença prêmio', 0),
(16, 'Prática jurídica', 0),
(17, 'Sistema indisponível', 1),
(18, 'Trabalho externo', 1),
(19, 'Viagem a serviço', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `permissao`
--

DROP TABLE IF EXISTS `permissao`;
CREATE TABLE IF NOT EXISTS `permissao` (
  `cod` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT 'Código da permissão',
  `nome` varchar(100) NOT NULL COMMENT 'Nome da permissão',
  `descricao` json NOT NULL COMMENT 'Descrição da permissão (json com as permissões disponíveis)',
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `permissao`
--

INSERT INTO `permissao` (`cod`, `nome`, `descricao`) VALUES
(1, 'Administrador', '\"admin\"'),
(3, 'Usuário comum', '\"user\"');

-- --------------------------------------------------------

--
-- Estrutura da tabela `registro`
--

DROP TABLE IF EXISTS `registro`;
CREATE TABLE IF NOT EXISTS `registro` (
  `cod` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código do registro',
  `cod_usuario` int(11) DEFAULT NULL COMMENT 'Código do usuário a que o registro se refere',
  `entrada` datetime DEFAULT NULL COMMENT 'Data e hora da entrada',
  `intervalo` datetime DEFAULT NULL COMMENT 'Data e hora do intervalo',
  `retorno` datetime DEFAULT NULL COMMENT 'Data e hora do retorno',
  `saida` datetime DEFAULT NULL COMMENT 'Data e hora da saída',
  `justificativa_entrada` tinyint(4) DEFAULT NULL COMMENT 'Código da justificativa da entrada',
  `justificativa_intervalo` tinyint(4) DEFAULT NULL COMMENT 'Código da justificativa do intervalo',
  `justificativa_retorno` tinyint(4) DEFAULT NULL COMMENT 'Código da justificativa do retorno',
  `justificativa_saida` tinyint(4) DEFAULT NULL COMMENT 'Código da justificativa da saída',
  PRIMARY KEY (`cod`),
  KEY `FOREIGN_JUSTIFICATIVA_ENTRADA` (`justificativa_entrada`),
  KEY `FOREIGN_JUSTIFICATIVA_SAIDA` (`justificativa_saida`),
  KEY `FOREIGN_JUSTIFICATIVA_INTERVALO` (`justificativa_intervalo`),
  KEY `FOREIGN_JUSTIFICATIVA_RETORNO` (`justificativa_retorno`),
  KEY `FOREIGN_USUARIO` (`cod_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `registro`
--

INSERT INTO `registro` (`cod`, `cod_usuario`, `entrada`, `intervalo`, `retorno`, `saida`, `justificativa_entrada`, `justificativa_intervalo`, `justificativa_retorno`, `justificativa_saida`) VALUES
(10, 2, '2019-07-11 14:00:00', '2019-07-11 19:00:00', '2019-07-11 20:00:00', '2019-07-11 23:00:00', NULL, NULL, NULL, 2),
(12, 1, '2019-07-19 19:06:24', '2019-07-19 19:06:32', '2019-07-19 19:06:39', NULL, NULL, NULL, NULL, NULL),
(13, 1, '2019-07-22 01:14:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Acionadores `registro`
--
DROP TRIGGER IF EXISTS `UPDATE_HORAS_TRABALHADAS`;
DELIMITER $$
CREATE TRIGGER `UPDATE_HORAS_TRABALHADAS` AFTER UPDATE ON `registro` FOR EACH ROW UPDATE usuario SET horas_trabalhadas = (
    SELECT SEC_TO_TIME((SUM(i) - SUM(e)) + (SUM(s) - SUM(r))) FROM (
    SELECT TIME_TO_SEC(r.entrada) AS e, TIME_TO_SEC(r.intervalo) AS i, TIME_TO_SEC(r.retorno) AS r, TIME_TO_SEC(r.saida) AS s FROM registro as r
        WHERE ( 
            (r.entrada IS NOT NULL AND r.intervalo IS NOT NULL AND r.retorno IS NOT NULL AND r.saida IS NOT NULL AND r.cod_usuario = OLD.cod_usuario) 
    	)
    
    UNION ALL
    
    SELECT TIME_TO_SEC(r.entrada) AS e, TIME_TO_SEC(r.intervalo) AS i, 0 AS r, 0 AS s FROM registro as r
        WHERE ( 
            (r.entrada IS NOT NULL AND r.intervalo IS NOT NULL AND r.retorno IS NOT NULL AND r.saida IS NULL AND r.cod_usuario = OLD.cod_usuario) 
    	)
    
    UNION ALL
    
    SELECT TIME_TO_SEC(r.entrada) AS e, TIME_TO_SEC(r.intervalo) AS i, 0 AS r, 0 AS s FROM registro as r
        WHERE ( 
            (r.entrada IS NOT NULL AND r.intervalo IS NOT NULL AND r.retorno IS NULL AND r.saida IS NULL AND r.cod_usuario = OLD.cod_usuario)
    	)
    ) AS r3 )
WHERE cod = OLD.cod_usuario
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `cod` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Código do usuário',
  `cod_cargo` tinyint(4) NOT NULL COMMENT 'Código do cargo do usuário',
  `cod_permissao` tinyint(4) NOT NULL COMMENT 'Código da peemissão do usuário',
  `nome` varchar(100) NOT NULL COMMENT 'Nome do usuário',
  `senha` varchar(255) NOT NULL COMMENT 'Senha do usuário (MD5)',
  `email` varchar(100) DEFAULT NULL COMMENT 'Email do usuário',
  `ramal` varchar(5) DEFAULT NULL COMMENT 'Número do ramal do usuário (opcional)',
  `horas_trabalhadas` time(6) NOT NULL DEFAULT '00:00:00.000000' COMMENT 'Número de horas trabalhadas',
  `data_inicio_contrato` date DEFAULT NULL COMMENT 'Data de início do contrato (caso for estagiário)',
  `data_fim_contrato` date DEFAULT NULL COMMENT 'Data de fim do contrato (caso for estagiário)',
  PRIMARY KEY (`cod`),
  UNIQUE KEY `nome_UNIQUE` (`nome`),
  UNIQUE KEY `ramal_UNIQUE` (`ramal`),
  KEY `FOREIGN_CARGO` (`cod_cargo`),
  KEY `FOREIGN_PERMISSAO` (`cod_permissao`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`cod`, `cod_cargo`, `cod_permissao`, `nome`, `senha`, `email`, `ramal`, `horas_trabalhadas`, `data_inicio_contrato`, `data_fim_contrato`) VALUES
(1, 3, 3, 'Matheus', '123', 'maot.rodrigues@gmail.com', '1234', '00:00:08.000000', NULL, NULL),
(2, 4, 1, 'Matheus2', '321', 'math.ota.rod@gmail.com', '3232', '08:00:00.000000', NULL, NULL),
(3, 2, 3, 'willa', '333', NULL, '445', '00:00:54.000000', NULL, NULL),
(4, 2, 3, 'will', '333', NULL, '444', '00:00:00.000000', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `registro`
--
ALTER TABLE `registro`
  ADD CONSTRAINT `FOREIGN_JUSTIFICATIVA_ENTRADA` FOREIGN KEY (`justificativa_entrada`) REFERENCES `justificativa` (`cod`),
  ADD CONSTRAINT `FOREIGN_JUSTIFICATIVA_INTERVALO` FOREIGN KEY (`justificativa_intervalo`) REFERENCES `justificativa` (`cod`),
  ADD CONSTRAINT `FOREIGN_JUSTIFICATIVA_RETORNO` FOREIGN KEY (`justificativa_retorno`) REFERENCES `justificativa` (`cod`),
  ADD CONSTRAINT `FOREIGN_JUSTIFICATIVA_SAIDA` FOREIGN KEY (`justificativa_saida`) REFERENCES `justificativa` (`cod`),
  ADD CONSTRAINT `FOREIGN_USUARIO` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod`);

--
-- Limitadores para a tabela `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FOREIGN_CARGO` FOREIGN KEY (`cod_cargo`) REFERENCES `cargo` (`cod`),
  ADD CONSTRAINT `FOREIGN_PERMISSAO` FOREIGN KEY (`cod_permissao`) REFERENCES `permissao` (`cod`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
