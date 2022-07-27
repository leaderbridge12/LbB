const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
        filterTypeId: Joi.string().required(),
        name: Joi.string().required(),
        // options: Joi.array().required(),
    }),

    handler: async (req, res) => {
        const { filterTypeId, name, options } = req.body;
        if (!filterTypeId || !name) {
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.INVALID_PARAMETERS,
                payload: {},
                logPayload: false
            };
            return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
        }

        const filterExist = await global.models.GLOBAL.FILTER_TYPE.findById(filterTypeId);
        if(!filterExist){
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: "filter type does not exist",
                payload: {},
                logPayload: false
            };
            return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
        }

        try {
            let filterCreate = {
                filterTypeId: filterTypeId,
                name: name,
            };
            const newFilter = await global.models.GLOBAL.FILTER(filterCreate);
            newFilter.save();
            const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.ITEM_INSERTED,
                payload: { newFilter },
                logPayload: false
            };
            res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
        } catch (error) {
            logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.GENERAL,
                payload: {},
                logPayload: false
            };
            res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
        }
    }
};
