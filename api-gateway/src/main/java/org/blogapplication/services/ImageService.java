package org.blogapplication.services;

import org.blogapplication.entity.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {
    ImageEntity uploadImage(MultipartFile file) throws IOException;

    List<ImageEntity> getImages();

    void deleteImage(String id) throws IOException;

    ImageEntity replaceImage(String id, MultipartFile file) throws IOException;
}
