import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	getMessaging,
	getToken,
	isSupported,
	onMessage,
} from "firebase/messaging";
const firebaseConfig = {
	apiKey: "AIzaSyB8gFH8gnMrR_2F6_7_c_bRelKNM6UCrJM",
	authDomain: "hungry-express-web-4dc93.firebaseapp.com",
	projectId: "hungry-express-web-4dc93",
	storageBucket: "hungry-express-web-4dc93.appspot.com",
	messagingSenderId: "751100814187",
	appId: "1:751100814187:web:4619e4c0bf1b19db12222e",
	measurementId: "",
};
const firebaseApp = !getApps().length
	? initializeApp(firebaseConfig)
	: getApp();
const messaging = (async () => {
	try {
		const isSupportedBrowser = await isSupported();
		if (isSupportedBrowser) {
			return getMessaging(firebaseApp);
		}
		return null;
	} catch (err) {
		return null;
	}
})();

export const fetchToken = async (setTokenFound, setFcmToken) => {
	return getToken(await messaging, {
		vapidKey: "",
	})
		.then((currentToken) => {
			if (currentToken) {
				setTokenFound(true);
				setFcmToken(currentToken);

				// Track the token -> client mapping, by sending to backend server
				// show on the UI that permission is secured
			} else {
				setTokenFound(false);
				setFcmToken();
				// shows on the UI that permission is required
			}
		})
		.catch((err) => {
			console.error(err);
			// catch error while creating client token
		});
};

export const onMessageListener = async () =>
	new Promise((resolve) =>
		(async () => {
			const messagingResolve = await messaging;
			onMessage(messagingResolve, (payload) => {
				resolve(payload);
			});
		})()
	);
export const auth = getAuth(firebaseApp);
