                // קולט את המידע ומעביר אותו למשתנים
                $name = $_POST['name'];
                $email = $_POST['email'];
                $topic = $_POST['topic'];
                $comments = $_POST['comments'];

                // המבנה של המייל שתקבלו כתגובה לשימוש בטופס - החליפו את המייל לשלכם
                $to = 'avihai673@gmail.com';
                $subject = "subject: $topic";
                $message = "$name wrote: $comments";
                $headers = "From: $email";

                // שולח אליכם את פרטי הטופס לפי פורמט הפקודה mail()
                mail($to, $subject, $message, $headers);

