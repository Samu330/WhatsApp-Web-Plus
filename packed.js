const main = () => {
    const WA_MODULES = {
        PROCESS_EDIT_MESSAGE: 189865,
        PROCESS_RENDERABLE_MESSAGES: 992321,
        MESSAGES_RENDERER: 809958,
    };

    const NEW_WA_MODULES = {
        PROCESS_EDIT_MESSAGE: 'WAWebDBProcessEditProtocolMsgs',
        PROCESS_RENDERABLE_MESSAGES: 'WAWebMessageProcessRenderable',
        MESSAGES_RENDERER: 'WAWebMessageMeta.react',
    };

    window.MODULES = {
        PROCESS_EDIT_MESSAGE: undefined,
        PROCESS_RENDERABLE_MESSAGES: undefined,
        MESSAGES_RENDERER: undefined,
    };

    const initialize_modules = () => {
        if (window?.webpackChunkwhatsapp_web_client) {
            window.mR = (() => {
                const mObj = {};
                window.webpackChunkwhatsapp_web_client.push([
                    ["moduleRaid"],
                    {},
                    (e) => Object.keys(e.m).forEach((mod) => mObj[mod] = e(mod))
                ]);

                const get = (id) => mObj[id];
                return {modules: mObj, get};
            })();
            MODULES = {
                PROCESS_EDIT_MESSAGE: window.mR.modules[WA_MODULES.PROCESS_EDIT_MESSAGE],
                PROCESS_RENDERABLE_MESSAGES: window.mR.modules[WA_MODULES.PROCESS_RENDERABLE_MESSAGES],
                MESSAGES_RENDERER: window.mR.modules[WA_MODULES.MESSAGES_RENDERER],
            };
        } else {
            MODULES = {
                PROCESS_EDIT_MESSAGE: require(NEW_WA_MODULES.PROCESS_EDIT_MESSAGE),
                PROCESS_RENDERABLE_MESSAGES: require(NEW_WA_MODULES.PROCESS_RENDERABLE_MESSAGES),
                MESSAGES_RENDERER: require(NEW_WA_MODULES.MESSAGES_RENDERER),
            };
        }

        alert(`Modules have been loaded successfully!\nBy Samu330 🍟`);
    };

    const view_once_handler = (message) => {
        if (message?.isViewOnce !== true) {
            return;
        }
        message.isViewOnce = false;
    };

    const revoke_handler = (message) => {
        if (!REVOKE_SUBTYPES.includes(message?.subtype)) {
            return false;
        }

        const originalMessage = message.protocolMessageKey.id; // Obtén el ID del mensaje original
        const messageElements = document.querySelectorAll(`[data-id="${originalMessage}"]`);
        if (messageElements.length) {
            messageElements[0].innerText += "\n> 🚫 *¡Este mensaje ha sido eliminado!*";
        }

        return false;
    };

    const handle_edited_message = function () {
        const message = arguments[0];
        const originalMessage = message.protocolMessageKey.id;
        const updatedMessageContent = `✏️ _Este mensaje ha sido editado:_\n\n*${message?.body || message?.caption}*`;

        const messageElements = document.querySelectorAll(`[data-id="${originalMessage}"]`);
        if (messageElements.length) {
            messageElements[0].innerText = updatedMessageContent;
        }

        return true; 
    };

    const initialize_edit_message_hook = () => {
        const originalProcessor = MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs || MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs;
        MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs = function () {
            if (!(window.webpackChunkwhatsapp_web_client?.length > 0)) {
                arguments[0] = arguments[0].filter((message) => {
                    return !handle_edited_message(message, ...arguments);
                });
            } else {
                if (!handle_edited_message(...arguments)) {
                    return;
                }
            }
            return originalProcessor(...arguments);
        };
        MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsg = MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs;
    };

    const initialize_message_hook = () => {
        const handle_message = (message) => {
            let should_ignore = false;
            should_ignore |= revoke_handler(message);
            return should_ignore;
        };

        const original_processor = MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages;
        MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages = function () {
            arguments[0] = arguments[0].filter((message) => {
                return !handle_message(message);
            });
            return original_processor(...arguments);
        };
    };

    const start = async () => {
        initialize_modules();
        initialize_message_hook();
        initialize_edit_message_hook();
    };

    console.log('WhatsApp-Plus loaded successfully!');
    setTimeout(start, 5000);
};

main();
