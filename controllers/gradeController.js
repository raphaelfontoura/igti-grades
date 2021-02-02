import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import { gradeModel } from '../models/gradeModel.js';

const create = async (req, res) => {
  try {
    const grade = new gradeModel(req.body);
    grade.lastModified = Date.now();
    await grade.save();
    console.log(grade);
    res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    logger.info(`GET /grade`);
    const grades = await gradeModel.find(condition);
    res.send(grades)
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const grade = await gradeModel.findById(id);
    res.send(grade);
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;
  let newGrade = req.body;
  newGrade.lastModified = Date.now();

  try {
    const grade = await gradeModel.findOneAndUpdate({ _id: id }, newGrade, { new: true });
    if (!grade) {
      return res.status(400).send({
        message: 'Id não econtrado.',
      });
    }
    res.send(grade);
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const gradeDeleted = await gradeModel.deleteOne({_id:id});
    console.log(gradeDeleted);
    logger.info(`DELETE /grade - ${id}`);
    res.status(202).send({contaDeletada: gradeDeleted.deletedCount});
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const deleteAll = await gradeModel.deleteMany({});
    res.status(202).send(deleteAll);
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
