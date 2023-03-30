import { AppDispatch } from "@/redux/configStore";
import { uploadImageApi } from "@/redux/reducers/userReducer";
import { EditOutlined, MenuOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Modal, Row, Space, Spin, Tooltip, Upload, message } from "antd";
import { UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IPhoto } from "../../../interface/photo-interface";
import { getAllPhotos } from "../../../redux/reducers/photoReducer";
import { http } from "../../../utils/config";
import profileStyle from "./profilePicture.module.scss";
import favoriteIcon from "@/public/images/profile/icons/favorite-icon.png";
const { Dragger } = Upload;

const ProfilePicture = () => {
    const [file, setFile] = useState<File[] | undefined>(undefined);
    const [isFetchImg, setIsFetchImg] = useState<boolean>(false);
    const [images, setImages] = useState<IPhoto[] | null>();
    const [open, setOpen] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isPreview, setIsPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const getAllPhoto = async () => {
            try {
                const data: IPhoto[] = (await dispatch(getAllPhotos())) as IPhoto[];
                const showFavoriteImageFirst = (images: IPhoto[]): IPhoto[] => {
                    const listSortImg = [...images];
                    listSortImg?.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
                    return listSortImg;
                };
                const result = showFavoriteImageFirst(data);
                setImages(result);
            } catch (error) {
                message.open({
                    type: "error",
                    content: "Đã xảy ra lỗi khi đăng tải hình ảnh",
                });
            }
        };
        getAllPhoto();
    }, [dispatch, isFetchImg]);

    const handleUpload = async () => {
        setIsLoading(true);
        const formData = new FormData();
        if (file && file.length > 0) {
            for (let i = 0; i < file.length; i++) {
                formData.append("files", file[i]);
            }
        }

        const data = await dispatch(uploadImageApi(formData));
        setIsLoading(false);
        if (data) {
            setIsFetchImg(!isFetchImg);
            messageApi.open({
                type: "success",
                content: "Đăng tải hình ảnh thành công",
            });
            setFile(undefined);
            setIsFetchImg(!isFetchImg);
        } else {
            messageApi.open({
                type: "error",
                content: "Đăng tải hình ảnh thất bại",
            });
        }
        setOpen(false);
    };

    const props: UploadProps = {
        name: "file",
        multiple: true,
        onChange(info) {
            const { fileList } = info;
            const files = Array.from(fileList)
                .filter((file) => file.originFileObj)
                .map((file) => file.originFileObj as File);
            setFile(files);
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    const showModal = () => {
        setIsPreview(true);
    };

    const handleDeleteImage = async (imageId: string): Promise<void> => {
        try {
            await http.delete(`photo/${imageId}`);
            messageApi.open({
                type: "success",
                content: "Xóa hình ảnh thành công",
            });
            setIsFetchImg(!isFetchImg);
        } catch (error) {
            message.open({
                type: "error",
                content: "Xóa hình ảnh thất bại",
            });
        }
    };

    const handleFavoriteImage = async (imageId: string): Promise<void> => {
        try {
            await http.put(`photo/set-favorite/${imageId}`);
            messageApi.open({
                type: "success",
                content: `Đã đặt ảnh yêu thích thành công`,
            });
            setIsFetchImg(!isFetchImg);
        } catch (error) {
            message.open({
                type: "error",
                content: "Đặt ảnh yêu thích thất bại",
            });
        }
    };

    return (
        <div className={profileStyle["profile__picture"]}>
            {contextHolder}
            <Button onClick={showModal} type={"ghost"}>
                <EditOutlined onClick={showModal} />
            </Button>
            <Modal
                title={
                    <div className={profileStyle["edit__modal"]}>
                        <span className={profileStyle["edit__modal--title"]}>Chỉnh sửa hình ảnh</span>
                        <span className={profileStyle["edit__modal--desc"]}>Điều chỉnh ảnh thích hợp để hiển thị</span>
                        <br></br>
                    </div>
                }
                onOk={() => setIsPreview(false)}
                open={isPreview}
                onCancel={() => setIsPreview(false)}
                width={"100vw"}
                footer={false}
            >
                <div className={profileStyle["photo-gallery"]}>
                    {images?.map((image: IPhoto, index: number) => (
                        <div key={index} className={profileStyle["photo-gallery__photo"]}>
                            {image?.link && (
                                <div className={profileStyle["image__preview"]}>
                                    {image.isFavorite && (
                                        <Tooltip placement="topLeft" title={"Bạn đang chọn ảnh này là ảnh yêu thích"}>
                                            <Image
                                                preview={false}
                                                src={favoriteIcon.src}
                                                alt="favorite photo"
                                                className={profileStyle["image__preview--icon"]}
                                            />
                                        </Tooltip>
                                    )}

                                    <Image
                                        preview={false}
                                        src={image.link}
                                        alt=""
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "0.75rem",
                                        }}
                                    />
                                </div>
                            )}
                            <div className={profileStyle["photo-gallery__actions"]}>
                                <Button
                                    type="primary"
                                    danger
                                    className={profileStyle["actions__delete"]}
                                    onClick={() => handleDeleteImage(image.id)}
                                >
                                    Xóa ảnh
                                </Button>

                                <Button
                                    type="primary"
                                    onClick={() => handleFavoriteImage(image.id)}
                                    className={profileStyle["actions__favorite"]}
                                >
                                    {image.isFavorite ? "Hủy yêu thích" : "Yêu thích"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={() => setIsPreview(false)}>Đóng</Button>
                </div>
            </Modal>
            <Image.PreviewGroup>
                <Row gutter={[13, 13]}>
                    {images?.slice(0, 1).map((image: IPhoto, index: number) => (
                        <Col key={index} span={images.length === 1 ? 24 : 16}>
                            {image.link && (
                                <Image
                                    src={image.link}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        maxHeight: "15rem",
                                        objectFit: "cover",
                                        boxShadow: "0 0 8px 0 #333",
                                    }}
                                />
                            )}
                        </Col>
                    ))}

                    <Col span={8}>
                        <Row gutter={[13, 13]}>
                            {images?.slice(1, 2).map((image: IPhoto, index: number) => (
                                <Col key={index} span={24}>
                                    {image.link && (
                                        <Image
                                            src={image.link}
                                            alt="profile-image"
                                            style={{
                                                width: "100%",
                                                height: "7rem",
                                                objectFit: "cover",
                                                boxShadow: "0 0 8px 0 #333",
                                            }}
                                        />
                                    )}
                                </Col>
                            ))}
                            {images?.slice(2, 3).map((image: IPhoto, index: number) => (
                                <Col key={index} span={24}>
                                    {image.link && (
                                        <Image
                                            src={image.link}
                                            alt="profile-image"
                                            style={{
                                                width: "100%",
                                                height: "7rem",
                                                objectFit: "cover",
                                                boxShadow: "0 0 8px 0 #333",
                                            }}
                                        />
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                <div style={{ marginTop: "0.625rem" }}></div>

                <Row gutter={[13, 13]}>
                    {images?.slice(3, 4).map((image: IPhoto, index: number) => (
                        <Col key={index} span={8}>
                            {image.link && (
                                <Image
                                    src={image.link}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "7rem",
                                        objectFit: "cover",
                                        boxShadow: "0 0 8px 0 #333",
                                    }}
                                />
                            )}
                        </Col>
                    ))}

                    {images && images.length > 5 && (
                        <Col span={8}>
                            <div className={profileStyle["image--container"]}>
                                <div className={profileStyle["overlay"]}>
                                    {images[5].link && (
                                        <Image
                                            src={images[5].link}
                                            style={{
                                                width: "100%",
                                                height: "7rem",
                                                objectFit: "cover",
                                                boxShadow: "0 0 8px 0 #333",
                                            }}
                                            alt=""
                                        />
                                    )}
                                    <div className={profileStyle["more--icon"]}>
                                        <span style={{ color: "white" }}>+{images.length - 5}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}
                    {images?.slice(6, -1).map((image: IPhoto, index: number) => (
                        <div key={index} style={{ display: "none" }}>
                            {image.link && <Image src={image.link} alt="" width={"100%"} />}
                        </div>
                    ))}
                    <Col span={8}>
                        <div className={profileStyle.picture__add} onClick={() => setOpen(true)}>
                            <div className={profileStyle["overlay"]}>
                                <div className="add-file">
                                    <label className={profileStyle["add--icon"]}>+</label>
                                    <div className={profileStyle["add--desc"]}>Thêm ảnh mới</div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Image.PreviewGroup>

            <Form.Item name="files" initialValue={file}>
                <Modal
                    title="Đăng tải hình ảnh"
                    open={open}
                    onCancel={() => {
                        setOpen(false);
                    }}
                    footer={null}
                >
                    {isLoading && (
                        <Space
                            direction="vertical"
                            style={{
                                width: "100%",
                                position: "absolute",
                                top: "50%",
                                left: "0",
                            }}
                        >
                            <Spin tip="Loading" size="large" style={{ display: "block" }}>
                                <div className="content" />
                            </Spin>
                        </Space>
                    )}

                    <Dragger {...props} accept=".png,.jpg,.jpeg" listType="picture" maxCount={10} multiple>
                        <Button icon={<UploadOutlined />}>Thêm ảnh từ thiết bị của bạn</Button>
                    </Dragger>

                    <Button
                        type="primary"
                        disabled={isLoading ? true : false}
                        style={{ width: "100%", marginTop: "1rem" }}
                        onClick={() => handleUpload()}
                    >
                        Thêm ảnh
                    </Button>
                </Modal>
            </Form.Item>
        </div>
    );
};

export default ProfilePicture;
