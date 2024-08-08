import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
  ImageGravity,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "6669c464003ba679d5b3",
  databaseId: "666da51e0002e398b807",
  userCollectionId: "666da535002956b73b01",
  videoCollectionId: "666da54c001ffd58c0cb",
  storageId: "666da79a0019350f653e",
};

// 初始化appwrite sdk
// https://github.com/appwrite/sdk-for-react-native?tab=readme-ov-file#init-your-sdk
// Init your React Native SDK
const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

export const createUser = async (email, password, username) => {
  try {
    console.log("ID.unique", ID.unique());
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log("newAccount--", newAccount);
    if (!newAccount) {
      throw Error;
    }
    const avatarUrl = avatars.getInitials(username);
    console.log("avatarUrl--", avatarUrl);
    await signIn(email, password);
    console.log("Sign In");

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );
    console.log("newUser--", newUser);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw error;
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw error;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw error;
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw error;
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("users", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log('getUserPosts serror--', error);
    throw error;
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  console.log('searchPosts query', query);
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      // 这里如果要用appwrite的sdk提供的search方法
      // 必须保证title属性创建了索引
      // https://appwrite.io/docs/products/databases/queries
      [Query.search("title", query)]
    );

    console.log('posts==', posts);

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    console.log('error', error)
    throw error;
  }
}


// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw error;
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  // 原项目是DocumentPicker.DocumentPickerAsset格式
  // 现在改成图片了
  // 我们就用ImagePicker.ImagePickerAsset格式来处理
  const { mimeType, fileName, fileSize, uri, ...rest } = file;
  const asset = { type: mimeType, size:fileSize, name: fileName || 'imageAsset.jpg',  uri  };

  console.log('asset---', asset);

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    console.log('uploadedFile---', uploadedFile);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log('error--', error);
    throw error;
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw error;
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw error;
  }
}
