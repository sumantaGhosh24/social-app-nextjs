"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import {destroyFromCloudinary, uploadToCloudinary} from "@/lib/cloudinary";
import {dynamicBlurDataUrl} from "@/lib/utils";
import ProductModel from "@/models/productModel";
import CategoryModel from "@/models/categoryModel";
import UserModel from "@/models/userModel";

import getServerUser from "./getServerUser";

interface FetchProductsParams {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  category?: string;
}

interface CreateProductParams {
  title: string;
  description: string;
  content: string;
  formData: any;
  category: string;
  price: string;
}

interface UpdateProductParams {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  price: string;
  path: string;
}

interface UpdateProductImageParams {
  id: string;
  formData: any;
  path: string;
}

interface DeleteProductImageParams {
  id: string;
  public_id: string;
  path: string;
}

const getCategoryByName = async (name: any) => {
  return CategoryModel.findOne({name: {$regex: name, $options: "i"}});
};

const populateProduct = (query: any) => {
  return query
    .populate({
      path: "owner",
      model: UserModel,
      select: "_id name email profileImage",
    })
    .populate({
      path: "category",
      model: CategoryModel,
      select: "_id name image",
    });
};

export async function getProduct(id: string) {
  try {
    connectDB();

    const product = await ProductModel.findById(id)
      .populate("owner", "_id name email profileImage")
      .populate("category", "_id name image");

    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    throw new Error(`Failed to get product data: ${error.message}`);
  }
}

export async function getProducts({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
  category,
}: FetchProductsParams) {
  try {
    connectDB();

    const titleCondition = searchString
      ? {title: {$regex: searchString, $options: "i"}}
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? {category: categoryCondition._id} : {},
      ],
    };
    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const productsQuery = ProductModel.find(conditions)
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const products = await populateProduct(productsQuery);
    const productsCount = await ProductModel.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(products)),
      totalPages: Math.ceil(productsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get products data: ${error.message}`);
  }
}

export async function createProduct({
  title,
  description,
  content,
  formData,
  category,
  price,
}: CreateProductParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const files = formData.getAll("files");

    const photos = await uploadToCloudinary(files);

    const blurDataPromise = photos.map((photo) =>
      dynamicBlurDataUrl(photo.secure_url)
    );

    const blurData = await Promise.all(blurDataPromise);

    const imageData = photos.map((photo, i) => ({
      url: photo.secure_url,
      public_id: photo.public_id,
      blurHash: blurData[i],
    }));

    const newProduct = new ProductModel({
      owner: user?._id,
      title,
      description,
      content,
      image: imageData,
      category,
      price,
    });

    await newProduct.save();

    revalidatePath("/product");
  } catch (error: any) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

export async function updateProduct({
  id,
  title,
  description,
  content,
  category,
  price,
  path,
}: UpdateProductParams) {
  try {
    connectDB();

    const product = await ProductModel.findById(id);
    if (!product) throw new Error("Product not found.");

    await ProductModel.findByIdAndUpdate(id, {
      title,
      description,
      content,
      category,
      price,
    });

    revalidatePath(path);
    revalidatePath("/product");
  } catch (error: any) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

export async function updateProductImage({
  id,
  formData,
  path,
}: UpdateProductImageParams) {
  try {
    connectDB();

    const product = await ProductModel.findById(id);
    if (!product) throw new Error("Product not found.");

    const files = formData.getAll("files");

    const photos = await uploadToCloudinary(files);

    const blurDataPromise = photos.map((photo) =>
      dynamicBlurDataUrl(photo.secure_url)
    );

    const blurData = await Promise.all(blurDataPromise);

    const imageData = photos.map((photo, i) => ({
      url: photo.secure_url,
      public_id: photo.public_id,
      blurHash: blurData[i],
    }));

    await ProductModel.findByIdAndUpdate(id, {
      image: [...product.image, ...imageData],
    });

    revalidatePath(path);
    revalidatePath("/product");
  } catch (error: any) {
    throw new Error(`Failed to update product image: ${error.message}`);
  }
}

export async function deleteProductImage({
  id,
  public_id,
  path,
}: DeleteProductImageParams) {
  try {
    connectDB();

    const product = await ProductModel.findById(id);
    if (!product) throw new Error("Product not found.");

    await Promise.all([
      ProductModel.findByIdAndUpdate(id, {
        image: product.image.filter((img: any) => img.public_id !== public_id),
      }),
      destroyFromCloudinary(public_id),
    ]);

    revalidatePath(path);
    revalidatePath("/product");
  } catch (error: any) {
    throw new Error(`Failed to delete product image: ${error.message}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    connectDB();

    const product = await ProductModel.findById(id);
    if (!product) throw new Error("This product does not exists.");

    product.image.map(
      async (img: any) => await destroyFromCloudinary(img.public_id)
    );

    await ProductModel.findByIdAndDelete(id);

    revalidatePath("/product");
  } catch (error: any) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}
