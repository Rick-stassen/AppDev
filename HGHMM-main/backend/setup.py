import os
import sys
import venv
import subprocess
from pathlib import Path
import socket
import time
import json
import platform
import shutil

def get_os_info():
    """Get detailed information about the operating system."""
    os_name = platform.system().lower()
    os_version = platform.version()
    os_release = platform.release()
    os_machine = platform.machine()
    
    print("\nOperating System Information:")
    print("-" * 30)
    print(f"System: {platform.system()}")
    print(f"Version: {os_version}")
    print(f"Release: {os_release}")
    print(f"Machine: {os_machine}")
    
    # Additional OS-specific information
    if os_name == "darwin":  # macOS
        mac_ver = platform.mac_ver()
        print(f"macOS Version: {mac_ver[0]}")
        print(f"Architecture: {mac_ver[2]}")
    elif os_name == "linux":
        try:
            # Try to get Linux distribution info
            import distro
            dist_info = distro.linux_distribution(full_distribution_name=True)
            print(f"Distribution: {dist_info[0]}")
            print(f"Version: {dist_info[1]}")
        except ImportError:
            # Fallback if distro is not available
            print("Linux distribution information not available")
    print("-" * 30)
    
    return {
        "name": os_name,
        "version": os_version,
        "release": os_release,
        "machine": os_machine
    }

def check_system_dependencies(os_info):
    """Check system dependencies based on OS."""
    os_name = os_info["name"]
    
    if os_name == "darwin":  # macOS
        # Check for Command Line Tools
        try:
            subprocess.run(["xcode-select", "-p"], check=True, capture_output=True)
        except subprocess.CalledProcessError:
            print("\nXcode Command Line Tools are not installed.")
            print("Please install them using: xcode-select --install")
            return False
    
    elif os_name == "linux":
        # Detect package manager
        if shutil.which("apt-get"):  # Debian/Ubuntu
            pkg_manager = "apt"
            install_cmd = ["sudo", "apt-get", "install", "-y"]
            update_cmd = ["sudo", "apt-get", "update"]
        elif shutil.which("dnf"):  # Fedora
            pkg_manager = "dnf"
            install_cmd = ["sudo", "dnf", "install", "-y"]
            update_cmd = ["sudo", "dnf", "check-update"]
        elif shutil.which("pacman"):  # Arch
            pkg_manager = "pacman"
            install_cmd = ["sudo", "pacman", "-S", "--noconfirm"]
            update_cmd = ["sudo", "pacman", "-Sy"]
        else:
            print("Unsupported Linux distribution. Please install dependencies manually.")
            return False
        
        try:
            # Update package lists
            subprocess.run(update_cmd, check=True)
            
            # Install required packages
            packages = []
            if pkg_manager == "apt":
                packages = ["python3-dev", "python3-pip", "python3-venv", "build-essential"]
            elif pkg_manager == "dnf":
                packages = ["python3-devel", "python3-pip"]
            elif pkg_manager == "pacman":
                packages = ["python-pip"]
            
            if packages:
                subprocess.run(install_cmd + packages, check=True)
                
        except subprocess.CalledProcessError as e:
            print(f"Failed to install system dependencies: {e}")
            return False
    
    return True

def get_python_command():
    """Get the appropriate Python command based on OS."""
    os_name = platform.system().lower()
    if os_name == "windows":
        # Check if 'py' launcher is available
        try:
            subprocess.run(["py", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return "py"
        except FileNotFoundError:
            return "python"
    elif os_name == "darwin":  # macOS
        # Check for python3 from Homebrew first
        brew_python = "/usr/local/bin/python3"
        if os.path.exists(brew_python):
            return brew_python
    return "python3"

def create_venv():
    """Create virtual environment with OS-specific considerations."""
    print("Checking for virtual environment...")
    venv_path = Path("venv")
    
    if not venv_path.exists():
        print("Creating virtual environment...")
        try:
            venv.create("venv", with_pip=True)
            return True
        except Exception as e:
            print(f"Error creating virtual environment: {e}")
            print("Attempting alternative method...")
            python_cmd = get_python_command()
            try:
                subprocess.run([python_cmd, "-m", "venv", "venv"], check=True)
                return True
            except subprocess.CalledProcessError as e:
                print(f"Failed to create virtual environment: {e}")
                sys.exit(1)
    return False

def get_venv_python():
    """Get virtual environment Python path based on OS."""
    os_name = platform.system().lower()
    if os_name == "windows":
        return str(Path("venv/Scripts/python.exe"))
    return str(Path("venv/bin/python"))

def get_venv_pip():
    """Get virtual environment pip path based on OS."""
    os_name = platform.system().lower()
    if os_name == "windows":
        return str(Path("venv/Scripts/pip.exe"))
    return str(Path("venv/bin/pip"))

def get_network_interfaces():
    """Get network interfaces with OS-specific handling."""
    interfaces = []
    
    # Get local IP using socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't actually connect but gets local IP
        s.connect(('8.8.8.8', 1))
        local_ip = s.getsockname()[0]
        if local_ip and not local_ip.startswith('127.'):
            interfaces.append(('Default Network', local_ip))
    except:
        # Fallback for offline scenarios
        try:
            # Try to get all network interfaces
            if platform.system().lower() == "windows":
                # Windows-specific network interface detection
                output = subprocess.check_output("ipconfig", shell=True).decode()
                for line in output.split('\n'):
                    if "IPv4 Address" in line:
                        ip = line.split(": ")[-1].strip()
                        if ip and not ip.startswith('127.'):
                            interfaces.append(('Windows Network', ip))
            else:
                # Unix-like systems
                import netifaces
                for iface in netifaces.interfaces():
                    addrs = netifaces.ifaddresses(iface)
                    if netifaces.AF_INET in addrs:
                        for addr in addrs[netifaces.AF_INET]:
                            ip = addr['addr']
                            if not ip.startswith('127.'):
                                interfaces.append((iface, ip))
        except:
            # If all else fails, add localhost
            interfaces.append(('Localhost', '127.0.0.1'))
    finally:
        s.close()
    
    return interfaces

def initialize_database():
    # Import here after requirements are installed
    from app import engine, Base
    
    def reset_database():
        try:
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            return True
        except Exception as e:
            print(f"Database error: {str(e)}")
            return False
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if reset_database():
                print("Database initialized successfully!")
                break
            else:
                raise Exception("Failed to initialize database")
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Database initialization failed, retrying in 5 seconds...")
                time.sleep(5)
            else:
                print(f"Error initializing database: {e}")
                print("Please check your database connection settings in .env file")
                return False
    return True

def setup_dev_environment():
    print("\nDevelopment Environment Setup")
    print("-" * 30)
    
    interfaces = get_network_interfaces()
    
    print("\nAvailable options:")
    for i, (iface, ip) in enumerate(interfaces, 1):
        print(f"{i}. {iface} ({ip})")
    print(f"{len(interfaces) + 1}. Android Emulator (10.0.2.2)")
    print(f"{len(interfaces) + 2}. Localhost (127.0.0.1)")
    print(f"{len(interfaces) + 3}. Manual IP entry")
    
    choice = input("\nSelect option (1-{}): ".format(len(interfaces) + 3))
    port = "8000"
    
    try:
        choice_num = int(choice)
        if 1 <= choice_num <= len(interfaces):
            ip = interfaces[choice_num - 1][1]
            base_url = f"http://{ip}:{port}"
            environment = "network"
        elif choice_num == len(interfaces) + 1:
            base_url = f"http://10.0.2.2:{port}"
            environment = "android"
        elif choice_num == len(interfaces) + 2:
            base_url = f"http://localhost:{port}"
            environment = "local"
        elif choice_num == len(interfaces) + 3:
            ip = input("Enter IP address: ")
            base_url = f"http://{ip}:{port}"
            environment = "manual"
        else:
            raise ValueError
    except (ValueError, IndexError):
        print("Invalid choice. Using localhost.")
        base_url = f"http://localhost:{port}"
        environment = "local"

    config = {
        "base_url": base_url,
        "environment": environment
    }
    
    with open("dev_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    print(f"\nDevelopment environment configured:")
    print(f"Base URL: {base_url}")
    return config

def check_database_url():
    """Check if the database URL is valid and provide guidance."""
    if not os.path.exists('.env'):
        print("\nNo .env file found. You need to create one with your database URL.")
        print("\nExample formats:")
        print("1. MySQL:")
        print('   DATABASE_URL="mysql+pymysql://username:password@host:port/database_name"')
        print("\n2. PostgreSQL:")
        print('   DATABASE_URL="postgresql://username:password@host:port/database_name"')
        print("\n3. SQLite (for development):")
        print('   DATABASE_URL="sqlite:///./app.db"')
        
        print("\nPlease create a .env file with your database URL before proceeding.")
        return False
    
    # Check if DATABASE_URL exists in .env
    with open('.env', 'r') as f:
        env_contents = f.read()
        if 'DATABASE_URL' not in env_contents:
            print("\nNo DATABASE_URL found in .env file.")
            print("Please add your database URL to the .env file.")
            return False
    
    return True

def setup():
    # Get OS information first
    os_info = get_os_info()
    
    # Check system dependencies
    if not check_system_dependencies(os_info):
        print("Failed to set up system dependencies. Please install them manually.")
        return
    
    print("\nSetup Type")
    print("-" * 30)
    print("1. Production")
    print("2. Development")
    
    setup_type = input("\nSelect setup type (1-2): ")
    
    # Check database configuration
    if not check_database_url():
        return
    
    # Create and activate venv if needed
    new_venv = create_venv()
    python_exe = get_venv_python()
    pip_exe = get_venv_pip()
    
    # Install requirements
    print("\nInstalling requirements...")
    try:
        # First upgrade pip
        subprocess.run([python_exe, "-m", "pip", "install", "--upgrade", "pip"], check=True)
        
        # Install OS-specific requirements first
        if os_info["name"] == "darwin":  # macOS
            subprocess.run([python_exe, "-m", "pip", "install", "wheel"], check=True)
        
        # Then install requirements
        if os_info["name"] == "windows":
            # Windows might need special handling for some packages
            subprocess.run([python_exe, "-m", "pip", "install", "-r", "requirements.txt", "--no-cache-dir"], check=True)
        else:
            subprocess.run([python_exe, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check your internet connection")
        print("2. Make sure you have the latest pip version")
        print("3. If on Windows, try running as administrator")
        print("4. Check if you have necessary build tools installed for your OS")
        if os_info["name"] == "windows":
            print("   - For Windows: Microsoft Visual C++ Build Tools")
        elif os_info["name"] == "linux":
            print("   - For Linux: python3-dev, build-essential")
        elif os_info["name"] == "darwin":
            print("   - For macOS: Command Line Tools (xcode-select --install)")
        return
    
    if setup_type == "2":  # Development
        # Setup development environment
        dev_config = setup_dev_environment()
        
        # Create or update api.config.js for frontend
        api_config = f"""// Auto-generated by setup.py
export const API_CONFIG = {{
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || '{dev_config["base_url"]}',
    ENVIRONMENT: '{dev_config["environment"]}',
    FALLBACK_URLS: [
        'http://10.0.2.2:8000',  // Android Emulator
        'http://localhost:8000',  // Local development
    ]
}};
"""
        frontend_config_dir = Path("../frontend/config")
        frontend_config_dir.mkdir(parents=True, exist_ok=True)
        
        config_file = frontend_config_dir / "api.config.js"
        with open(config_file, "w") as f:
            f.write(api_config)
    
    # Initialize database
    print("\nInitializing database...")
    print("(This will reset the database if it already exists)")
    
    if not initialize_database():
        return
    
    print("\nSetup complete! You can now run the application with:")
    if os_info["name"] == "windows":
        print("uvicorn app:app --reload --host 0.0.0.0")
    else:
        print("uvicorn app:app --reload")
    
    if setup_type == "2":
        print(f"\nAPI will be available at: {dev_config['base_url']}")
    
    # Print additional help
    print("\nTo reset the database in the future, run:")
    print(f"{get_python_command()} setup.py --reset-db")

if __name__ == "__main__":
    try:
        # Check for --reset-db flag
        if len(sys.argv) > 1 and sys.argv[1] == "--reset-db":
            print("Resetting database...")
            if initialize_database():
                print("Database reset complete!")
            sys.exit(0)
        
        setup()
    except KeyboardInterrupt:
        print("\nSetup cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nAn unexpected error occurred: {str(e)}")
        print("Please report this issue with the error details above.")
        sys.exit(1)