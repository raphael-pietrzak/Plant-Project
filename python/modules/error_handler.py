class ErrorHandler:
    """Classe simple pour gérer les erreurs de façon centralisée"""
    
    @staticmethod
    def handle(function, *args, default_return=None, error_msg="Erreur"):
        """
        Exécute une fonction avec gestion d'erreurs
        
        Args:
            function: La fonction à exécuter
            *args: Arguments à passer à la fonction
            default_return: Valeur à retourner en cas d'erreur
            error_msg: Message à afficher en cas d'erreur
            
        Returns:
            Le résultat de la fonction ou default_return en cas d'erreur
        """
        try:
            return function(*args)
        except Exception as e:
            print(f"❌ {error_msg}: {e}")
            return default_return
    
    @staticmethod
    def safe_init(init_func, *args, error_msg="Erreur d'initialisation"):
        """Initialisation sécurisée d'un composant"""
        try:
            return init_func(*args)
        except Exception as e:
            print(f"❌ {error_msg}: {e}")
            return None
