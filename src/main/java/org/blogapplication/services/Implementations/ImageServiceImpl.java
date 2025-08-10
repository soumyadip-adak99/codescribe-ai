package org.blogapplication.services.Implementations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.blogapplication.entity.ImageEntity;
import org.blogapplication.repository.ImageRepository;
import org.blogapplication.services.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final Cloudinary cloudinary;

    @Override
    public ImageEntity uploadImage(MultipartFile file) throws IOException {
        Map uploadedFile = cloudinary.uploader().upload(
                file.getBytes(), ObjectUtils.asMap(
                        "folder", "image_uploads",
                        "resource_type", "auto"
                )
        );

        ImageEntity imageData = ImageEntity.builder()
                .publicId(uploadedFile.get("public_id").toString())
                .imageUrl(uploadedFile.get("secure_url").toString())
                .build();


        return imageRepository.save(imageData);
    }

    @Override
    public List<ImageEntity> getImages() {
        return imageRepository.findAll();
    }

    @Override
    public void deleteImage(String id) throws IOException {
        ImageEntity image = imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));

        // delete from cloudinary
        cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());

        // Delete image from database
        imageRepository.delete(image);
    }

    @Override
    public ImageEntity replaceImage(String id, MultipartFile file) throws IOException {
        // delete the exiting image
        deleteImage(id);

        // upload the new image
        return uploadImage(file);
    }
}
