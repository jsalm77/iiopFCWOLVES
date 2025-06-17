// Cloudinary Configuration for FC Wolves
// هذا الملف يحتوي على إعدادات Cloudinary لرفع الصور

// إعدادات Cloudinary (ستحتاج إلى تحديثها بإعداداتك الخاصة)
const CLOUDINARY_CONFIG = {
    cloudName: 'YOUR_CLOUD_NAME', // سيتم تحديثه لاحقاً
    uploadPreset: 'YOUR_UPLOAD_PRESET', // سيتم تحديثه لاحقاً
    apiKey: 'YOUR_API_KEY' // اختياري للرفع غير الموقع
};

// دالة لرفع الصورة إلى Cloudinary
async function uploadImageToCloudinary(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('فشل في رفع الصورة');
        }

        const data = await response.json();
        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// دالة لإنشاء Upload Widget من Cloudinary
function createCloudinaryUploadWidget(callback) {
    if (typeof cloudinary === 'undefined') {
        console.error('Cloudinary SDK غير محمل');
        return null;
    }

    return cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'], // مصادر الرفع
        multiple: false, // رفع صورة واحدة فقط
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        theme: 'minimal',
        styles: {
            palette: {
                window: '#1a1a2e',
                sourceBg: '#16213e',
                windowBorder: '#3b82f6',
                tabIcon: '#f59e0b',
                inactiveTabIcon: '#6b7280',
                menuIcons: '#f59e0b',
                link: '#3b82f6',
                action: '#f59e0b',
                inProgress: '#3b82f6',
                complete: '#10b981',
                error: '#ef4444',
                textDark: '#ffffff',
                textLight: '#e5e7eb'
            }
        },
        text: {
            ar: {
                'menu.files': 'الملفات',
                'menu.web': 'الويب',
                'menu.camera': 'الكاميرا',
                'local.browse': 'تصفح الملفات',
                'local.dd_title_single': 'اسحب وأفلت صورة هنا',
                'local.dd_title_multi': 'اسحب وأفلت الصور هنا',
                'camera.capture': 'التقط صورة',
                'camera.cancel': 'إلغاء',
                'camera.take_pic': 'التقط صورة وارفعها',
                'camera.explanation': 'تأكد من أن الكاميرا متصلة ومتاحة للمتصفح',
                'progress.uploading': 'جاري الرفع...',
                'progress.processing': 'جاري المعالجة...',
                'progress.uploaded': 'تم الرفع بنجاح',
                'queue.title': 'قائمة الرفع',
                'queue.title_uploading_with_counter': 'جاري رفع {{num}} ملف',
                'queue.title_processing_with_counter': 'جاري معالجة {{num}} ملف',
                'queue.title_uploaded_with_counter': 'تم رفع {{num}} ملف',
                'queue.retry': 'إعادة المحاولة',
                'queue.abort': 'إلغاء',
                'queue.done': 'تم',
                'queue.remove': 'إزالة',
                'crop.title': 'قص الصورة',
                'crop.crop_btn': 'قص',
                'crop.skip_btn': 'تخطي',
                'crop.reset_btn': 'إعادة تعيين',
                'crop.close_btn': 'إغلاق',
                'crop.close_prompt': 'إغلاق النافذة سيلغي جميع عمليات الرفع، هل أنت متأكد؟',
                'crop.image_error': 'خطأ في تحميل الصورة',
                'crop.corner_tooltip': 'اسحب الزاوية لتغيير الحجم',
                'crop.handle_tooltip': 'اسحب المقبض لتغيير الحجم'
            }
        },
        language: 'ar'
    }, callback);
}

// دالة مساعدة لضغط الصورة قبل الرفع (اختيارية)
function compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // حساب الأبعاد الجديدة
            let { width, height } = img;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            // رسم الصورة المضغوطة
            ctx.drawImage(img, 0, 0, width, height);

            // تحويل إلى blob
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };

        img.src = URL.createObjectURL(file);
    });
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CLOUDINARY_CONFIG,
        uploadImageToCloudinary,
        createCloudinaryUploadWidget,
        compressImage
    };
}

